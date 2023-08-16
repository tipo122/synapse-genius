import { useEffect, useRef, useState } from "react";
// import { singletonHook } from "react-singleton-hook";
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

export const useCanvasData = (): {
  canvasData: Canvas;
  canvasImageData: string;
  saveCanvasData: (canvas: Canvas) => void;
  saveCanvasImageData: (canvas_data: string) => void;
} => {
  const [user] = useAuthState(auth);
  const user_id = user ? user.uid : "";
  const [canvasData, setCanvasData] = useState<Canvas>(initialCanvasData);
  const [canvasImageData, setCanvasImageData] = useState<string>("");
  const loading = useRef<boolean>(false);
  const canvasDataRef = useRef<Canvas>(initialCanvasData);
  const canvasImageDataRef = useRef<string>("");
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
            setCanvasImageData(canvasData.canvas_data as string);
          });
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
    console.log(canvasDataRef.current);
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

  return { canvasData, canvasImageData, saveCanvasData, saveCanvasImageData };
};

// useCanvasDataImpl();

// const init = {
//   canvasData: initialCanvasData,
//   canvasImageData: "",
//   saveCanvasData: useCanvasDataImpl.prototype.saveCanvasData,
//   saveCanvasImageData: useCanvasDataImpl.prototype.saveCanvasImageData,
// };

// export const useCanvasData = singletonHook(init, useCanvasDataImpl);
