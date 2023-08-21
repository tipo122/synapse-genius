import React, { useEffect, useState } from "react";
import "./Home.css";
import { List, Card, Col, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Canvas } from "@domain-types/canvas";
import { initialCanvasData } from "@hooks/useCanvasData";

const { Meta } = Card;

const Home = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const user_id = user ? user.uid : "";
  const [canvases, setCanvases] = useState<Canvas[]>();
  let loading = false;

  useEffect(() => {
    if (!loading && user_id !== "") {
      (async () => {
        loading = true;
        const q = query(
          collection(db, "canvases"),
          where("user_id", "==", user_id)
        );
        const result: Canvas[] = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          result.push({ ...doc.data(), uid: doc.id } as Canvas);
        });
        setCanvases([{ uid: "new" } as Canvas, ...result]);
        loading = false;
      })();
    }
  }, []);

  const handleNewCanvas = async () => {
    initialCanvasData.user_id = user_id;
    const docRef = await addDoc(collection(db, "canvases"), initialCanvasData);
    navigate(`/canvas/${docRef.id}`);
  };

  return (
    <>
      <h1>Home</h1>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={canvases}
        renderItem={(canvas) =>
          canvas.uid === "new" ? (
            <List.Item>
              <Card
                hoverable
                style={{ width: 240, height: 240 }}
                onClick={handleNewCanvas}
              >
                <Meta title="新規作成" />
              </Card>
            </List.Item>
          ) : (
            <List.Item>
              <Link to={`/canvas/${canvas.uid}`}>
                <Card hoverable style={{ width: 240, height: 240 }}>
                  <Meta title={canvas.title} />
                  サムネイルはまだ
                </Card>
              </Link>
            </List.Item>
          )
        }
      />
    </>
  );
};

export default Home;
