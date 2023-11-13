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
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { httpsCallable } from "firebase/functions";

export const CreateList = () => {
  const storage = getStorage();
  const navigate = useNavigate();
  const { templates, templateType, searchTemplate, setTemplates } =
    useContext(CreateContext);
  const { canvasId } = useParams();
  const { canvasData, saveCanvasData, saveCanvasImageData } = useCanvasData(
    canvasId ?? ""
  );
  const alreadyReading = useRef<boolean>(false);
  const ImageStore = useRef<{ id: string; image: string }[]>([]);
  const [ImageList, setImageList] = useState<{ id: string; image: string }[]>(
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

  const handleClick = (templateId: string) => {
    ImageStore.current.push({ id: "test", image: "tets" });
    // (async () => {
    //   const templateURL = `https://firebasestorage.googleapis.com/v0/b/${process.env.REACT_APP_FIREBASE_STORAGEBUCKET}/o/templates%2F${templateId}.svg?alt=media`;
    //   saveCanvasData({ ...canvasData, canvas_data: templateURL });
    // })();
    // navigate(`/canvas/${canvasId}`);
  };
  console.log(`ImageStore.current is ${ImageStore}`);
  return (
    <>
      <div style={{ width: "600px", textAlign: "right" }}>
        <br />
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={[...ImageStore.current]}
          renderItem={(item) => (
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
