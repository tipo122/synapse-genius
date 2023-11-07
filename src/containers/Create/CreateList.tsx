import React, { useContext, useEffect } from "react";
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
  // const { selectedObjects, editor, onReady } = useFabricJSEditor();

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
      }
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
      // const templateName = `templates/${templateId}.svg`;
      // const templateFileRef = ref(storage, templateName);
      // const jsonurl = await getDownloadURL(templateFileRef);
      // const result = await fetch(jsonurl);

      const templateURL = `https://firebasestorage.googleapis.com/v0/b/${process.env.REACT_APP_FIREBASE_STORAGEBUCKET}/o/templates%2F${templateId}.svg?alt=media`;
      // const templateURL = `http://127.0.0.1:5001/synapse-genius-dev-fbe11/us-central1/on_get_embedded_template?template_id=CZ5BXSCQHtcZxG8eP3br`

      saveCanvasData({ ...canvasData, canvas_data: templateURL });
    })();
    navigate(`/canvas/${canvasId}`);
  };

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
                  // src={`https://firebasestorage.googleapis.com/v0/b/${process.env.REACT_APP_FIREBASE_STORAGEBUCKET}/o/templates%2F${item}.svg?alt=media`}
                  src={`${getFunctionPath()}?template_id=${item}`}
                  width={190}
                  height={190}
                />
                {/* <FabricJSCanvas className="synapse-canvas" onReady={onReady} /> */}
              </Card>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};
