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
  addText: (text: string) => void;
  updateText: (text: string) => void;
  changeTextFont: (fontFamily: string) => void;
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
  setCanvas: (text: string) => void;
}
export interface FabricJSCanvasProps {
  className?: string;
  onReady?: (canvas: fabric.Canvas) => void;
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
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE,
        fill: fillColor,
        stroke: strokeColor,
      });
      canvas.add(object);
      onChange && onChange(JSON.stringify(canvas));
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE,
        fill: fillColor,
        stroke: strokeColor,
      });
      canvas.add(object);
      onChange && onChange(JSON.stringify(canvas));
    },
    addLine: () => {
      const object = new fabric.Line(LINE.points, {
        ...LINE.options,
        stroke: strokeColor,
      });
      canvas.add(object);
      onChange && onChange(JSON.stringify(canvas));
    },
    addText: (text: string) => {
      // use stroke in text fill, fill default is most of the time transparent
      const object = new fabric.Textbox(text, { ...TEXT, fill: strokeColor });
      object.set({ text: text });
      canvas.add(object);
      onChange && onChange(JSON.stringify(canvas));
    },
    updateText: (text: string) => {
      const objects: any[] = canvas.getActiveObjects();
      if (objects.length && objects[0].type === TEXT.type) {
        const textObject: fabric.Textbox = objects[0];
        textObject.set({ text });
        canvas.renderAll();
        onChange && onChange(JSON.stringify(canvas));
      }
    },
    changeTextFont: (fontFamily: string) =>{
      canvas.getActiveObjects().forEach((object) => object.set({fontFamily: fontFamily}));
      canvas.renderAll();
      onChange && onChange(JSON.stringify(canvas));
    },
    deleteAll: () => {
      canvas.getObjects().forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();
      canvas.renderAll();
      onChange && onChange(JSON.stringify(canvas));
    },
    deleteSelected: () => {
      canvas.getActiveObjects().forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();
      canvas.renderAll();
      onChange && onChange(JSON.stringify(canvas));
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
    fillColor,
    strokeColor,
    setFillColor: (fill: string) => {
      _setFillColor(fill);
      canvas.getActiveObjects().forEach((object) => object.set({ fill }));
      canvas.renderAll();
      onChange && onChange(JSON.stringify(canvas));
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
      onChange && onChange(JSON.stringify(canvas));
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
        onChange && onChange(JSON.stringify(canvas));
      });
    };
    if (canvas) {
      bindEvents(canvas);
    }
  }, [canvas]);

  return {
    selectedObjects,
    onReady: (canvasReady: fabric.Canvas): void => {
      console.log("Fabric canvas ready");
      setCanvas(canvasReady);
    },
    editor: canvas
      ? buildEditor(
          canvas,
          fillColor,
          strokeColor,
          setFillColor,
          setStrokeColor,
          scaleStep,
          onChange
        )
      : undefined,
  };
};

/**
 * Fabric canvas as component
 */
const FabricJSCanvas = ({ className, onReady }: FabricJSCanvasProps) => {
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

    onReady && onReady(canvas);

    return () => {
      canvas.dispose();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div ref={canvasElParent} className={className}>
      <canvas ref={canvasEl} />
    </div>
  );
};

export type { FabricJSEditorHook };
export { buildEditor, FabricJSCanvas, useFabricJSEditor };
