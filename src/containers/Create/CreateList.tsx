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
  const ImageStore = useRef<string[]>([]);
  const [ImageList, setImageList] = useState<string[]>([]);

  const getEmbeddedTemplate: ({
    template_id,
    canvas_id,
  }) => Promise<{ data: any }> = httpsCallable(
    functions,
    "on_get_embedded_template"
  );

  useEffect(() => {
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
        search_result.data.forEach(async (templateId, i) => {
          ({ data: ImageStore.current[i] } = await getEmbeddedTemplate({
            template_id: templateId,
            canvas_id: canvasId,
          }));
        });
      }
      setImageList(ImageStore.current);
    })();
  }, [canvasData]);

  const getFunctionPath = () => {
    const { projectId } = app.options;
    const { region } = functions;
    // @ts-ignore
    const emulator = functions.emulatorOrigin;
    let url: string = "";

    if (emulator) {
      url = `${emulator}/${projectId}/${region}/on_get_embedded_template`;
    } else {
      url = `https://${region}-${projectId}.cloudfunctions.net/on_get_embedded_template`;
    }
    return url;
  };

  const handleClick = (templateId: string) => {
    (async () => {
      const templateURL = `https://firebasestorage.googleapis.com/v0/b/${process.env.REACT_APP_FIREBASE_STORAGEBUCKET}/o/templates%2F${templateId}.svg?alt=media`;
      saveCanvasData({ ...canvasData, canvas_data: templateURL });
    })();
    navigate(`/canvas/${canvasId}`);
  };

  useEffect(() => {
    console.log(ImageList);
  }, [ImageList]);

  return (
    <>
      <div style={{ width: "600px", textAlign: "right" }}>
        <br />
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={templates}
          renderItem={(item, i) => (
            <List.Item>
              <Card
                hoverable
                style={{ width: 240, height: 240 }}
                onClick={() => handleClick(item)}
              >
                <Card.Meta />
                <img
                  src={`data:image/svg+xml;base64,${ImageList[i]}`}
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
