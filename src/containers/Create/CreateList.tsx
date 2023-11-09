import React, { useContext, useEffect } from "react";
import { List, Card } from "antd";
import { Typography } from "antd";
import { CreateContext } from "./CreateContainer";
import { useNavigate, useParams } from "react-router-dom";

import { useCanvasData } from "@hooks/useCanvasData";
import { app, functions } from "../../firebase";
import { getStorage } from "firebase/storage";

export const CreateList = () => {
  const storage = getStorage();
  const navigate = useNavigate();
  const { templates, templateType, searchTemplate, setTemplates } =
    useContext(CreateContext);
  const { canvasId } = useParams();
  const { canvasData, saveCanvasData } = useCanvasData(canvasId ?? "");

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
      const templateURL = `${getFunctionPath()}?template_id=${templateId}&canvas_id=${canvasId}`;
      console.log(templateURL);
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
                  src={`${getFunctionPath()}?template_id=${item}&canvas_id=${canvasId}`}
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
