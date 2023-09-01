import React, { useContext, useEffect } from "react";
import { List, Card, Col, Row } from "antd";
import { Button, Input, Layout, Typography, theme } from "antd";
import { CreateContext } from "./CreateContainer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { initialCanvasData, useCanvasData } from "@hooks/useCanvasData";
import { collection, doc, getDoc, query } from "firebase/firestore";
import { db } from "../../firebase";

const { Text, Title } = Typography;

export const CreateList = () => {
  // const { targetUrl, setTargetUrl, handleStart } = useContext(CreateContext);
  const { canvasId } = useParams();
  const { saveCanvasData, saveCanvasImageData } = useCanvasData(canvasId ?? "");
  const creatives = ["1", "2", "3", "4", "5"];

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
                  <img src={`/img/${item}.png`} width={190} height={190} />
                </Card>
              </Link>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};
