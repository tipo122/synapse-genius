import { useEffect, useState } from "react";
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
import { db } from "../firebase";
import { Canvas } from "@domain-types/canvas";

interface UseCanvasDataProps {
  user_id: string;
}

export const initialCanvasData: Canvas = {
  uid: "",
  user_id: "",
  template_id: "",
  copydata: {
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

export const useCanvasData = ({
  user_id,
}: UseCanvasDataProps): {
  canvas: Canvas;
  saveCanvasData: (canvas: Canvas | undefined) => Promise<void>;
} => {
  const [canvas, setCanvas] = useState<Canvas>(initialCanvasData);
  const q = query(collection(db, "canvases"), where("user_id", "==", user_id));

  useEffect(() => {
    const loadCanvas = async () => {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        initialCanvasData.user_id = user_id;
        const docRef = await addDoc(
          collection(db, "canvases"),
          initialCanvasData
        );
        initialCanvasData.uid = docRef.id;
        setCanvas(initialCanvasData);
      } else {
        querySnapshot.forEach((doc) => setCanvas(doc.data() as Canvas));
      }
    };
    loadCanvas().then(() => console.log(canvas));
  }, []);

  const saveCanvasData = async (canvas: Canvas | undefined) => {
    // canvas && setDoc(doc(db, "canvases", canvas.uid), {}, { merge: true });
  };

  return { canvas, saveCanvasData };
};
