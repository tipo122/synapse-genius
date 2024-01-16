import React, { useEffect, useState } from "react";
import { List, Card, Modal } from "antd";
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
  const [modal, contextHolder] = Modal.useModal();

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
    const docRef = await addDoc(collection(db, "canvases"), {
      ...initialCanvasData,
      create_dt: new Date(),
    });
    navigate(`/canvas/${docRef.id}`);
  };

  const handleDeleteCanvas = (canvasId) => {
    deleteDoc(doc(db, "canvases", canvasId));
    loadCanvases();
  };

  const handleSort = (a, b) => {
    if (a.uid === "new") return -1;
    if (b.uid === "new") return 1;

    if (!a.create_dt) return 1;
    if (!b.create_dt) return -1;

    if (a.create_dt?.toDate().getTime() > b.create_dt?.toDate().getTime())
      return -1;
    if (a.create_dt?.toDate().getTime() < b.create_dt?.toDate().getTime())
      return 1;
    return 0;
  };

  return (
    <>
      <h1>Home</h1>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={canvases.sort(handleSort)}
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
                  <DeleteIcon
                    onClick={() =>
                      modal.confirm({
                        content: `${canvas.title} を削除します。`,
                        title: "削除",
                        onOk: () => handleDeleteCanvas(canvas.uid),
                      })
                    }
                  />
                </div>
              </Card>
            </List.Item>
          )
        }
      />
      {contextHolder}
    </>
  );
};

export default Home;
