import React, { useEffect, useState } from "react";
import "./Home.css";
import { List, Card, Col, Row } from "antd";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Canvas } from "@domain-types/canvas";

const { Meta } = Card;

const Home = () => {
  const [user] = useAuthState(auth);
  const user_id = user ? user.uid : "";
  const [canvases, setCanvases] = useState<Canvas[]>();
  let loading = false;

  useEffect(() => {
    if (!loading) {
      (async () => {
        loading = true;
        const q = query(
          collection(db, "canvases"),
          where("user_id", "==", user_id)
        );
        const result: Canvas[] = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          result.push(doc.data() as Canvas);
        });
        setCanvases([{ uid: "new" } as Canvas, ...result]);
        console.log(canvases);
        loading = false;
      })();
    }
  }, []);

  return (
    <>
      <h1>Home</h1>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={canvases}
        renderItem={(canvas) =>
          canvas.uid === "new" ? (
            <List.Item>
              <Link to="/canvas/new">
                <Card hoverable style={{ width: 240, height: 240 }}>
                  <Meta title="新規作成" />
                </Card>
              </Link>
            </List.Item>
          ) : (
            <List.Item>
              <Link to={`/canvas/${canvas.uid}`}>
                <Card hoverable style={{ width: 240, height: 240 }}>
                  <Meta title={canvas.uid} description="www.instagram.com" />
                  {canvas.user_id}
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
