import React, { useContext, useEffect, useRef, useState } from "react";
import { List, Card, Col, Row } from "antd";
import { Button, Input, Layout, Typography, theme } from "antd";
import { CreateContext } from "./CreateContainer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fabric } from "fabric";
import {
  FabricJSCanvas,
  useFabricJSEditor,
} from "../../hooks/useFabricJSEditor";
import { initialCanvasData, useCanvasData } from "@hooks/useCanvasData";
import { collection, doc, getDoc, query } from "firebase/firestore";
import { app, db, functions } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { httpsCallable } from "firebase/functions";

const { Text, Title } = Typography;

export const CreateList = () => {
  const storage = getStorage();
  const navigate = useNavigate();
  const size = (i) => (i === 0 ? 2 : 1);
  const { templates, templateType, searchTemplate, setTemplates } =
    useContext(CreateContext);
  const { canvasId } = useParams();
  const { canvasData, saveCanvasData, saveCanvasImageData } = useCanvasData(
    canvasId ?? ""
  );
  const ImageStore = useRef<{ image: string; id: string }[]>([]);
  const [ImageList, setImageList] = useState<{ image: string; id: string }[]>(
    []
  );

  const getEmbeddedTemplate: ({
    template_id,
    canvas_id,
  }) => Promise<{ data: any }> = httpsCallable(
    functions,
    "on_get_embedded_template"
  );

  useEffect(() => {
    if (ImageStore.current.length === 0) {
      (async () => {
        if (
          templates.length === 0 &&
          canvasData.template_property.template_type
        ) {
          const search_result = await searchTemplate({
            text_query: "",
            template_type: canvasData.template_property.template_type,
          });
          setTemplates(search_result.data);

          const imagePromises = search_result.data.map((templateId) => {
            return getEmbeddedTemplate({
              template_id: templateId,
              canvas_id: canvasId,
            }).then((response) => {
              // ImageStore.current.push({ image: response.data, id: templateId });
              return { image: response.data, id: templateId };
            });
          });
          // ImageStore.current = await Promise.all(imagePromises);
          setImageList(await Promise.all(imagePromises));
        }
      })();
    }
  }, [canvasData]);

  // useEffect(() => {
  //   setImageList(ImageStore.current);
  // }, [ImageStore.current.length]);

  const handleClick = (templateId: string) => {
    const canvasFileRef = canvasId
      ? ref(storage, `creative/${templateId}.json`)
      : null;

    (async () => {
      const selectedTemplate = ImageList.find((item) => item.id === templateId);
      var canvas = new fabric.Canvas("canvas");
      selectedTemplate &&
        fabric.loadSVGFromString(
          selectedTemplate.image,
          function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            canvas.add(obj).renderAll();
          }
        );
      selectedTemplate && console.log(selectedTemplate.image);
      canvasFileRef &&
        selectedTemplate &&
        (await uploadString(canvasFileRef, selectedTemplate.image));
      navigate(`/canvas/${canvasId}`);
    })();
  };

  return (
    <>
      <div style={{ width: "600px", textAlign: "right" }}>
        <br />
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={ImageList}
          renderItem={(item, i) => (
            <List.Item>
              <Card
                hoverable
                style={{ width: 240, height: 240 }}
                onClick={() => handleClick(item.id)}
              >
                <Card.Meta />
                <img
                  src={`data:image/svg+xml;base64,${item.image}`}
                  width={190}
                  height={190}
                />
              </Card>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};
