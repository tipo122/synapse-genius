import React, { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
// import { useFabricJSEditor, FabricJSEditor, FabricJSEditorHook } from './editor'

// import { fabric } from 'fabric'
import {
  CIRCLE,
  RECTANGLE,
  LINE,
  TEXT,
  FILL,
  STROKE,
} from "../types/defaultShapes";

export interface FabricJSEditor {
  canvas: fabric.Canvas;
  addCircle: () => void;
  addRectangle: () => void;
  addLine: () => void;
  addText: (text: string, pos?: { x: number; y: number }) => void;
  updateText: (text: string) => void;
  changeTextFont: (fontFamily: string) => void;
  changeTextSize: (textSize: number) => void;
  changeBoldFont: (apply: boolean) => void;
  changeItalicFont: (apply: boolean) => void;
  changeUnderLineFont: (apply: boolean) => void;
  changeStrikethroughFont: (apply: boolean) => void;
  addImage: (imageFile: string) => void;
  deleteAll: () => void;
  deleteSelected: () => void;
  fillColor: string;
  strokeColor: string;
  setFillColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  bringForward: () => void;
  sendBackwards: () => void;
  toSVG: () => any;
  loadSVG: (svgURL: string) => void;
  setCanvas: (text: string) => void;
  handleDrop: (item: any) => void;
}
export interface FabricJSCanvasProps {
  className?: string;
  onReady?: (canvas: fabric.Canvas) => void;
  onDrop?: (e: any) => void;
  onClick?: (e: any) => void;
}
interface FabricJSEditorHookProps {
  defaultFillColor?: string;
  defaultStrokeColor?: string;
  scaleStep?: number;
  onChange?: (string: string) => void;
}
interface FabricJSEditorState {
  editor?: FabricJSEditor;
}
interface FabricJSEditorHook extends FabricJSEditorState {
  selectedObjects?: fabric.Object[];
  onReady: (canvas: fabric.Canvas) => void;
  handleDrop: (event: any) => void;
  setDropItem: (item: string) => void;
}

/**
 * Creates editor
 */
const buildEditor = (
  canvas: fabric.Canvas,
  fillColor: string,
  strokeColor: string,
  _setFillColor: (color: string) => void,
  _setStrokeColor: (color: string) => void,
  scaleStep: number,
  onChange?: (string: string) => void
): FabricJSEditor => {
  return {
    canvas,
    handleDrop: (item) => {
      debugger;
    },
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE,
        fill: fillColor,
        stroke: strokeColor,
      });
      canvas.add(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE,
        fill: fillColor,
        stroke: strokeColor,
      });
      canvas.add(object);
    },
    addLine: () => {
      const object = new fabric.Line(LINE.points, {
        ...LINE.options,
        stroke: strokeColor,
      });
      canvas.add(object);
    },
    addText: (text: string, pos?: { x: number; y: number }) => {
      // use stroke in text fill, fill default is most of the time transparent
      const object = new fabric.Textbox(text, {
        ...TEXT,
        fill: strokeColor,
        ...(pos && {
          left: pos.x,
          top: pos.y,
        }),
      });
      object.set({ text: text });
      canvas.add(object);
    },
    updateText: (text: string) => {
      const objects: any[] = canvas.getActiveObjects();
      if (objects.length && objects[0].type === TEXT.type) {
        const textObject: fabric.Textbox = objects[0];
        textObject.set({ text });
        canvas.renderAll();
      }
    },
    changeTextFont: (fontFamily: string) => {
      canvas
        .getActiveObjects()
        .forEach((object) => object.set({ fontFamily: fontFamily }));
      canvas.renderAll();
    },
    changeTextSize: (textSize: number) => {
      canvas
        .getActiveObjects()
        .forEach((object) => object.set({ fontSize: textSize }));
      canvas.renderAll();
    },
    changeBoldFont: (apply: boolean) => {
      if (apply) {
        canvas
          .getActiveObjects()
          .forEach((object) => object.set({ fontWeight: "bold" }));
        canvas.renderAll();
        return;
      }
      canvas
        .getActiveObjects()
        .forEach((object) => object.set({ fontWeight: "normal" }));
      canvas.renderAll();
    },
    changeItalicFont: (apply: boolean) => {
      if (apply) {
        canvas
          .getActiveObjects()
          .forEach((object) => object.set({ fontStyle: "italic" }));
        canvas.renderAll();
        return;
      }
      canvas
        .getActiveObjects()
        .forEach((object) => object.set({ fontStyle: "normal" }));
      canvas.renderAll();
    },
    changeUnderLineFont: (apply: boolean) => {
      canvas
        .getActiveObjects()
        .forEach((object) => object.set({ underline: apply }));
      canvas.renderAll();
    },
    changeStrikethroughFont: (apply: boolean) => {
      canvas
        .getActiveObjects()
        .forEach((object) => object.set({ linethrough: apply }));
      canvas.renderAll();
    },
    addImage: (imageUrl: string) => {
      fabric.Image.fromURL(imageUrl, (img) => {
        canvas.add(img);
      });
    },
    deleteAll: () => {
      canvas.getObjects().forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    deleteSelected: () => {
      canvas.getActiveObjects().forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    sendBackwards: () => {
      canvas
        .getActiveObjects()
        .forEach((object) => canvas.sendBackwards(object));
    },
    bringForward: () => {
      canvas
        .getActiveObjects()
        .forEach((object) => canvas.bringForward(object));
    },
    toSVG: () => {
      return canvas.toSVG();
    },
    loadSVG: async (svgUrl: string) => {
      fabric.loadSVGFromURL(svgUrl, (objects) => {
        objects.forEach((svg) => {
          canvas.add(svg).renderAll();
        });
      });
    },
    fillColor,
    strokeColor,
    setFillColor: (fill: string) => {
      _setFillColor(fill);
      canvas.getActiveObjects().forEach((object) => object.set({ fill }));
      canvas.renderAll();
    },
    setStrokeColor: (stroke: string) => {
      _setStrokeColor(stroke);
      canvas.getActiveObjects().forEach((object) => {
        if (object.type === TEXT.type) {
          // use stroke in text fill
          object.set({ fill: stroke });
          return;
        }
        object.set({ stroke });
      });
      canvas.renderAll();
    },
    zoomIn: () => {
      const zoom = canvas.getZoom();
      canvas.setZoom(zoom / scaleStep);
    },
    zoomOut: () => {
      const zoom = canvas.getZoom();
      canvas.setZoom(zoom * scaleStep);
    },
    setCanvas: (canvasData) => {
      canvas.loadFromJSON(canvasData);
    },
  };
};

const useFabricJSEditor = ({
  defaultFillColor,
  defaultStrokeColor,
  scaleStep = 0.5,
  onChange,
}: FabricJSEditorHookProps = {}): FabricJSEditorHook => {
  const [canvas, setCanvas] = useState<null | fabric.Canvas>(null);
  const [fillColor, setFillColor] = useState<string>(defaultFillColor || FILL);
  const [strokeColor, setStrokeColor] = useState<string>(
    defaultStrokeColor || STROKE
  );
  const [selectedObjects, setSelectedObject] = useState<fabric.Object[]>([]);
  const [dropItemText, setDropItemText] = useState<string>("");

  const [editor, setEditor] = useState<FabricJSEditor>(
    undefined as unknown as FabricJSEditor
  );

  const setDropItem = (item) => {
    setDropItemText(item);
  };

  const handleDrop = (e: DragEvent) => {
    console.log(dropItemText);
    editor?.addText(dropItemText, { x: e.clientX, y: e.clientY });
  };

  const onReady = (canvasReady: fabric.Canvas): void => {
    console.log("Fabric canvas ready");
    setCanvas(canvasReady);
  };

  useEffect(() => {
    console.log(dropItemText);
  }, [dropItemText]);

  useEffect(() => {
    const bindEvents = (canvas: fabric.Canvas) => {
      canvas.on("selection:cleared", () => {
        setSelectedObject([]);
      });
      canvas.on("selection:created", (e: any) => {
        setSelectedObject(e.selected);
      });
      canvas.on("selection:updated", (e: any) => {
        setSelectedObject(e.selected);
      });
      canvas.on("object:modified", (e: any) => {
        console.log("modefied");
        onChange && onChange(JSON.stringify(canvas));
      });
    };
    if (canvas) {
      bindEvents(canvas);
      canvas.setZoom(0.8);
      setEditor(
        buildEditor(
          canvas,
          fillColor,
          strokeColor,
          setFillColor,
          setStrokeColor,
          scaleStep,
          onChange
        )
      );
    }
  }, [canvas]);

  return {
    selectedObjects,
    onReady,
    handleDrop,
    setDropItem,
    editor,
  };
};

/**
 * Fabric canvas as component
 */
const FabricJSCanvas = ({
  className,
  onReady,
  onDrop,
  onClick,
}: FabricJSCanvasProps) => {
  const canvasEl = useRef(null);
  const canvasElParent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current);
    const setCurrentDimensions = () => {
      canvas.setHeight(canvasElParent.current?.clientHeight || 0);
      canvas.setWidth(canvasElParent.current?.clientWidth || 0);
      canvas.renderAll();
    };
    const resizeCanvas = () => {
      setCurrentDimensions();
    };
    setCurrentDimensions();

    // const resizeObserver = new ResizeObserver(resizeCanvas);
    // canvasEl.current && resizeObserver.observe(canvasEl.current);
    window.addEventListener("resize", resizeCanvas, false);

    // canvasElParent.current?.addEventListener("drop", handleDrop, false);

    onReady && onReady(canvas);

    return () => {
      canvas.dispose();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const handleDrop = (e) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    onDrop && onDrop(e);
    // debugger;
  };

  return (
    <div
      ref={canvasElParent}
      className={className}
      onDrop={handleDrop}
      onClick={onClick}
    >
      <canvas ref={canvasEl} />
    </div>
  );
};

export type { FabricJSEditorHook };
export { buildEditor, FabricJSCanvas, useFabricJSEditor };
