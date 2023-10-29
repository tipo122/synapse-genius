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
import { db } from "../../firebase";

const { Text, Title } = Typography;

export const CreateList = () => {
  const { creatives, targetUrl, setTargetUrl, handleStart } =
    useContext(CreateContext);
  const { canvasId } = useParams();
  const { saveCanvasData, saveCanvasImageData } = useCanvasData(canvasId ?? "");
  // const creatives = ["1", "2", "3"];
  const { selectedObjects, editor, onReady } = useFabricJSEditor();

  useEffect(() => {
    (async () => {
      let template_data = "";
      const snapshot = await getDoc(
        doc(db, "templates", "WgxpZYMkjCVpt52dreXN")
      );
      if (snapshot.exists()) template_data = snapshot.data().canvas_data;
      saveCanvasImageData(template_data);
    })();
  }, []);

  return (
    <>
      <div style={{ width: "600px", textAlign: "right" }}>
        <br />
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={creatives}
          renderItem={(item) => (
            <List.Item>
              <Link to={`/canvas/${canvasId}`}>
                <Card hoverable style={{ width: 240, height: 240 }}>
                  <Card.Meta />
                  <img
                    src={`https://firebasestorage.googleapis.com/v0/b/${process.env.REACT_APP_FIREBASE_STORAGEBUCKET}/o/templates%2F${item}.png?alt=media`}
                    width={190}
                    height={190}
                  />
                  <FabricJSCanvas
                    className="synapse-canvas"
                    onReady={onReady}
                  />
                </Card>
              </Link>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};
