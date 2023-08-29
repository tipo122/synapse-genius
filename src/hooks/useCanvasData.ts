import { useEffect, useRef, useState } from "react";
import { doc, collection, setDoc, addDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Canvas } from "@domain-types/canvas";

export const initialCanvasData: Canvas = {
  uid: "",
  user_id: "",
  title: "Untitled",
  template_id: "",
  copy_data: {
    strings: [""],
  },
  bg_image_uid: "",
  bg_image_prompt: "",
  item_property: {
    item_url: "",
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

export interface CanvasDataInterface {
  canvasId: string;
  canvasData: Canvas;
  canvasImageData: string;
  saveCanvasData: (canvas: Canvas) => void;
  saveCanvasImageData: (canvas_data: string) => void;
  error: boolean;
}

export const useCanvasData = (canvasIdProp: string): CanvasDataInterface => {
  const [user] = useAuthState(auth);
  const user_id = user ? user.uid : "";
  const [error, setError] = useState<boolean>(false);
  const [canvasId, setCanvasId] = useState<string>(canvasIdProp);
  const [canvasData, setCanvasData] = useState<Canvas>(initialCanvasData);
  const [canvasImageData, setCanvasImageData] = useState<string>("");
  const loading = useRef<boolean>(false);
  const canvasDataRef = useRef<Canvas>(initialCanvasData);
  const canvasImageDataRef = useRef<string>("");

  useEffect(() => {
    if (!loading.current) {
      loading.current = true;

      (async () => {
        if (canvasIdProp === "new") {
          initialCanvasData.user_id = user_id;
          const docRef = await addDoc(
            collection(db, "canvases"),
            initialCanvasData
          );
          setCanvasId(docRef.id);
          return;
        }
        const docRef = doc(db, "canvases", canvasId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const doc = { ...docSnap.data(), uid: docSnap.id } as Canvas;
          setCanvasData(doc);
          setCanvasImageData(doc.canvas_data as string);
        } else {
          setError(true);
        }
        loading.current = false;
      })();
    }
  }, []);

  useEffect(() => {
    canvasDataRef.current = canvasData;
  }, [canvasData]);

  useEffect(() => {
    canvasImageDataRef.current = canvasImageData;
  }, [canvasImageData]);

  const saveCanvasData = (canvas: Canvas) => {
    canvas.canvas_data = canvasImageDataRef.current;
    saveCanvasDataMain(canvas);
  };

  const saveCanvasImageData = (canvas_data: string) => {
    setCanvasImageData(canvas_data);
    saveCanvasDataMain({ ...canvasDataRef.current, canvas_data: canvas_data });
  };

  const saveCanvasDataMain = async (canvas: Canvas) => {
    try {
      canvas && (await setDoc(doc(db, "canvases", canvas.uid), canvas));
    } catch (e: any) {
      console.error(e);
    }
  };

  return {
    canvasId,
    canvasData,
    canvasImageData,
    saveCanvasData,
    saveCanvasImageData,
    error,
  };
};
