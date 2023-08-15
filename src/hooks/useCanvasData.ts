import { useEffect, useRef, useState } from "react";
import { singletonHook } from "react-singleton-hook";
import {
  DocumentReference,
  doc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Canvas } from "@domain-types/canvas";

interface UseCanvasDataProps {
  user_id: string;
}

export const initialCanvasData: Canvas = {
  uid: "",
  user_id: "",
  template_id: "",
  copy_data: {
    strings: [""],
  },
  bg_image_uid: "",
  bg_image_prompt: "",
  item_property: {
    item_name: "",
    item_category: "",
    item_description: "",
  },
  campaign_property: {
    campaign_name: "",
    campaign_description: "",
  },
  canvas_data: "",
};

const init = {
  canvasData: initialCanvasData,
  saveCanvasData: () => {},
};

export const useCanvasDataImpl = (): {
  canvasData: Canvas;
  saveCanvasData: (canvas: Canvas | undefined) => void;
} => {
  const [user] = useAuthState(auth);
  const user_id = user ? user.uid : "";
  const [canvasData, setCanvasData] = useState<Canvas>(initialCanvasData);
  const loading = useRef<boolean>(false);
  const q = query(collection(db, "canvases"), where("user_id", "==", user_id));

  useEffect(() => {
    if (!loading.current) {
      loading.current = true;
      (async () => {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          console.log("new");
          initialCanvasData.user_id = user_id;
          const docRef = await addDoc(
            collection(db, "canvases"),
            initialCanvasData
          );
          initialCanvasData.uid = docRef.id;
          setCanvasData(initialCanvasData);
        } else {
          console.log("load");
          querySnapshot.forEach((doc) => {
            const canvasData = { ...(doc.data() as Canvas), uid: doc.id };
            setCanvasData(canvasData);
          });
        }
        loading.current = false;
      })();
    }
  }, []);

  const saveCanvasData = async (canvas: Canvas | undefined) => {
    try {
      canvas && setDoc(doc(db, "canvases", canvas.uid), canvas);
    } catch (e: any) {
      console.error(e);
    }
  };

  return { canvasData: canvasData, saveCanvasData };
};

export const useCanvasData = singletonHook(init, useCanvasDataImpl);
