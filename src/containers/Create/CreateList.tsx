import { fabric } from "fabric";
import React, { useContext, useEffect, useRef, useState } from "react";
import { List, Card, Col, Row } from "antd";
import { Button, Input, Layout, Typography, theme } from "antd";
import { CreateContext } from "./CreateContainer";
import { Link, useNavigate, useParams } from "react-router-dom";
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

export const CreateList = () => {
  interface templateImage {
    id: string;
    image: string;
  }
  const storage = getStorage();
  const navigate = useNavigate();
  const { templates, templateType, searchTemplate, setTemplates } =
    useContext(CreateContext);
  const { canvasId } = useParams();
  const { canvasData, saveCanvasData, saveCanvasImageData } = useCanvasData(
    canvasId ?? ""
  );
  const [ImageList, setImageList] = useState<templateImage[]>([]);
  const canvasDataName = `creative/${canvasId}.json`;
  const canvasFileRef = canvasId ? ref(storage, canvasDataName) : null;
  const alreadyReading = useRef<boolean>(false);
  const ImageStore = useRef<templateImage[]>([]);

  const getEmbeddedTemplate: ({
    template_id,
    canvas_id,
  }) => Promise<{ data: any }> = httpsCallable(
    functions,
    "on_get_embedded_template"
  );

  useEffect(() => {
    if (!alreadyReading.current) {
      alreadyReading.current = true;
      if (templates.length > 0) {
        setTemplateData(templates);
      } else {
        (async () => {
          const resultData = await searchTemplate({
            text_query: "",
            template_type: canvasData.template_property.template_type,
          });
          setTemplateData(resultData.data);
        })();
      }
    }
  }, [canvasData]);

  const setTemplateData = async (idList) => {
    // console.log(`settemplatedata: ${idList}`);
    for (const templateId of idList) {
      const { data: image } = await getEmbeddedTemplate({
        template_id: templateId,
        canvas_id: canvasId,
      });
      ImageStore.current.push({ id: templateId, image: image });
      setImageList([...ImageStore.current]);
      console.log([...ImageStore.current]);
    }
    alreadyReading.current = true;
  };

  const handleClick = async (templateImage: string) => {
    var canvas = new fabric.Canvas("cx");

    fabric.loadSVGFromString(atob(templateImage), function (objects, options) {
      var svg = fabric.util.groupSVGElements(objects, options);
      canvas.add(svg);
      canvas.renderAll();
    });
    var canvas_data = canvas.toJSON();
    console.log(JSON.stringify(canvas_data));
    canvasFileRef &&
      (await uploadString(canvasFileRef, JSON.stringify(canvas_data)));
    navigate(`/canvas/${canvasId}`);
  };

  return (
    <>
      <div style={{ width: "500px", textAlign: "right" }}>
        <br />
        {ImageStore.current.length >= 1 ? (
          <Card
            hoverable
            style={{ width: 500, height: 500, marginBottom: "8px" }}
            onClick={() => handleClick(ImageStore.current[0].image)}
          >
            <Card.Meta />
            <img
              src={`data:image/svg+xml;base64,${ImageStore.current[0].image}`}
              width={450}
              height={450}
            />
          </Card>
        ) : null}

        <List
          grid={{ column: 2 }}
          dataSource={[...ImageStore.current.slice(1)]}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                style={{ width: 250, height: 250 }}
                onClick={() => handleClick(item.image)}
              >
                <Card.Meta />
                <img
                  src={`data:image/svg+xml;base64,${item.image}`}
                  width={200}
                  height={200}
                />
              </Card>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};
