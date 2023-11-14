import { useEffect, useRef, useState } from "react";
import {
  doc,
  collection,
  setDoc,
  addDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import {
  getBytes,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { Canvas } from "@domain-types/canvas";
import { FabricJSEditor } from "./useFabricJSEditor";

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
  template_property: {
    template_type: "",
  },
  canvas_data: "",
  thumbnail: "",
};

export interface CanvasDataInterface {
  canvasId: string;
  canvasData: Canvas;
  canvasImageData: string;
  saveCanvasData: (canvas: any) => void;
  saveCanvasImageData: (canvas_data: string) => void;
  saveThumbnail: (editor: FabricJSEditor) => void;
  loadTemplate: (editor: FabricJSEditor) => void;
  error: boolean;
}

export const useCanvasData = (canvasIdProp: string): CanvasDataInterface => {
  const [user] = useAuthState(auth);
  const storage = getStorage();
  const user_id = user ? user.uid : "";
  const [error, setError] = useState<boolean>(false);
  const [canvasId, setCanvasId] = useState<string>(canvasIdProp);
  const [canvasData, setCanvasData] = useState<Canvas>(initialCanvasData);
  const [canvasImageData, setCanvasImageData] = useState<string>("");
  const loading = useRef<boolean>(false);
  const loaded = useRef<boolean>(false);
  const unsub = useRef<() => void>(() => {});
  const canvasDataRef = useRef<Canvas>(initialCanvasData);
  const canvasImageDataRef = useRef<string>("");
  const thumbnailName = `thumbnail/${canvasId}.svg`;
  const canvasDataName = `creative/${canvasId}.json`;
  const thumbnailRef = canvasId ? ref(storage, thumbnailName) : null;
  const canvasFileRef = canvasId ? ref(storage, canvasDataName) : null;

  const updateCanvasData = (doc) => {
    setCanvasData({ ...doc.data(), uid: canvasDataRef.current.uid });
  };

  useEffect(() => {
    if (!loading.current && canvasId) {
      loading.current = true;

      (async () => {
        if (canvasIdProp === "new") {
          initialCanvasData.user_id = user_id;
          const docRef = await addDoc(
            collection(db, "canvases"),
            initialCanvasData
          );
          setCanvasId(docRef.id);
          canvasFileRef && (await uploadString(canvasFileRef, "{}"));
          setCanvasImageData(JSON.stringify({}));
          return;
        }
        const docRef = doc(db, "canvases", canvasId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const doc = { ...docSnap.data(), uid: docSnap.id } as Canvas;
          unsub.current = onSnapshot(docRef, updateCanvasData);
          setCanvasData(doc);
          try {
            if (canvasFileRef) {
              const jsonurl = await getDownloadURL(canvasFileRef);
              const result = await fetch(jsonurl);
              const data = await JSON.stringify(result);
              setCanvasImageData(JSON.stringify(data));
            }
          } catch (e) {
            // canvasFileRef && (await uploadString(canvasFileRef, "{}"));
            // setCanvasImageData(JSON.stringify({}));
            console.log(e);
          }
        } else {
          setError(true);
        }
        loading.current = false;
      })();
    }
    return () => {
      unsub.current();
    };
  }, []);

  useEffect(() => {
    canvasDataRef.current = canvasData;
  }, [canvasData]);

  useEffect(() => {
    canvasImageDataRef.current = canvasImageData;
  }, [canvasImageData]);

  const loadTemplate = (editor: FabricJSEditor) => {
    console.log(canvasData.canvas_data);
    if ((canvasData.canvas_data as string).startsWith("http")) {
      (async () => {
        const result = await fetch(canvasData.canvas_data as string);
        result.body && (await editor.loadSVG(canvasData.canvas_data as string));
        loaded.current = true;
        saveCanvasDataMain({ ...canvasData, canvas_data: "" });
        saveThumbnail(editor);
        setCanvasImageData(JSON.stringify(editor?.canvas));
      })();
    } else {
      loaded.current = true;
    }
  };

  const saveThumbnail = (editor: FabricJSEditor) => {
    if (loaded.current) {
      const content = new Blob([editor.toSVG()], {
        type: "image/svg+xml",
      });
      const metadata = {
        contentType: "image/svg+xml",
      };
      thumbnailRef && uploadBytes(thumbnailRef, content, metadata);
      console.log("save thumbnail");
    }
  };

  const saveCanvasData = (canvas: any) => {
    saveCanvasDataMain(canvas);
  };

  const saveCanvasImageData = (
    canvas_data: string,
    editor?: FabricJSEditor
  ) => {
    if (loaded.current) {
      setCanvasImageData(canvas_data);
      (async () => {
        try {
          canvasFileRef && (await uploadString(canvasFileRef, canvas_data));
          console.log(canvas_data);
          console.log("save canvas image data");
        } catch (e) {
          console.log(e);
          console.log("create new creative data");
        }
      })();
      // // saveCanvasDataMain({ ...canvasDataRef.current, canvas_data: canvas_data });
      // canvas_data &&
      //   setDoc(doc(db, "canvases", canvasId), { canvas_data }, { merge: true });
    }
  };

  const saveCanvasDataMain = async (canvas: Canvas) => {
    // if (!(canvas.canvas_data as string).startsWith("https")) {
    //   canvas.canvas_data = "";
    // }
    setCanvasData(canvas);
    try {
      canvas &&
        (await setDoc(doc(db, "canvases", canvas.uid), canvas, {
          merge: true,
        }));
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
    saveThumbnail,
    loadTemplate,
    error,
  };
};
