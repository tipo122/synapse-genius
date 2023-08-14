import { useEffect, useRef, useState } from "react";
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

export const useCanvasData = ({
  user_id,
}: UseCanvasDataProps): {
  canvasData: Canvas;
  saveCanvasData: (canvasData: Canvas | undefined) => Promise<void>;
} => {
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
