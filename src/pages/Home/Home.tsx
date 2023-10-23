import React, { useEffect, useState } from "react";
import { List, Card } from "antd";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Canvas } from "@domain-types/canvas";
import { initialCanvasData } from "@hooks/useCanvasData";
import DeleteIcon from "@mui/icons-material/Delete";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import "./Home.css";

const { Meta } = Card;

const Home = () => {
  const navigate = useNavigate();
  const storage = getStorage();
  const [user] = useAuthState(auth);
  const user_id = user ? user.uid : "";
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  let loading = false;

  useEffect(() => {
    loadCanvases();
  }, []);

  const loadCanvases = () => {
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
  };

  const handleNewCanvas = async () => {
    initialCanvasData.user_id = user_id;
    const docRef = await addDoc(collection(db, "canvases"), initialCanvasData);
    navigate(`/canvas/${docRef.id}`);
  };

  const handleDeleteCanvas = (canvasId) => {
    deleteDoc(doc(db, "canvases", canvasId));
    loadCanvases();
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
              <Card
                hoverable
                style={{ width: 240, height: 240 }}
                onClick={() => navigate(`/canvas/${canvas.uid}`)}
              >
                <Meta title={canvas.title} />
                <img
                  src={`https://firebasestorage.googleapis.com/v0/b/${process.env.REACT_APP_FIREBASE_STORAGEBUCKET}/o/thumbnail%2F${canvas.uid}.svg?alt=media`}
                  width={160}
                  height={160}
                />
                <div
                  className="controleIcons"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <DeleteIcon onClick={() => handleDeleteCanvas(canvas.uid)} />
                </div>
              </Card>
            </List.Item>
          )
        }
      />
    </>
  );
};

export default Home;
