import { fabric } from "fabric";
import { v4 as uuid4 } from "uuid";

import { defaultNavElement } from "@/constants";
import { createSpecificShape } from "./shapes";

// initialize fabric canvas
export const initializeFabric = ({ fabricRef, canvasRef }) => {
  const canvasElement = document.getElementById("canvas");
  if (!canvasRef.current || !canvasElement) return null;

  const canvas = new fabric.Canvas(canvasRef.current, {
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
  });

  fabricRef.current = canvas;

  return canvas;
};

// instantiate creation of custom fabric object/shape and add it to canvas
export const handleCanvasMouseDown = ({
  options,
  canvas,
  selectedShapeRef,
  isDrawing,
  shapeRef,
}) => {
  const pointer = canvas.getPointer(options.e);
  const target = canvas.findTarget(options.e, false);
  canvas.isDrawingMode = false;

  if (selectedShapeRef.current === "freeform") {
    isDrawing.current = true;
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.width = 5;
    return;
  }

  canvas.isDrawingMode = false;

  if (
    target &&
    (target.type === selectedShapeRef.current ||
      target.type === "activeSelection")
  ) {
    isDrawing.current = false;
    canvas.setActiveObject(target);
    target.setCoords();
  } else {
    isDrawing.current = true;

    shapeRef.current = createSpecificShape(selectedShapeRef.current, pointer);

    if (shapeRef.current) {
      canvas.add(shapeRef.current);
    }
  }
};

// handle mouse move event on canvas to draw shapes with different dimensions
export const handleCanvaseMouseMove = ({
  options,
  canvas,
  isDrawing,
  selectedShapeRef,
  shapeRef,
  syncShapeInStorage,
}) => {
  if (!isDrawing.current || selectedShapeRef.current === "freeform") return;

  canvas.isDrawingMode = false;
  const pointer = canvas.getPointer(options.e);

  switch (selectedShapeRef.current) {
    case "rectangle":
    case "triangle":
    case "image":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;

    case "circle":
      shapeRef.current?.set({
        radius: Math.abs(pointer.x - (shapeRef.current?.left || 0)) / 2,
      });
      break;

    case "line":
      shapeRef.current?.set({
        x2: pointer.x,
        y2: pointer.y,
      });
      break;

    default:
      break;
  }

  canvas.renderAll();

  if (shapeRef.current?.objectId) {
    syncShapeInStorage(shapeRef.current);
  }
};

// handle mouse up event on canvas to stop drawing shapes
export const handleCanvasMouseUp = ({
  canvas,
  isDrawing,
  shapeRef,
  activeObjectRef,
  selectedShapeRef,
  syncShapeInStorage,
  setActiveElement,
}) => {
  isDrawing.current = false;
  if (selectedShapeRef.current === "freeform") return;

  syncShapeInStorage(shapeRef.current);

  shapeRef.current = null;
  activeObjectRef.current = null;
  selectedShapeRef.current = null;

  if (!canvas.isDrawingMode) {
    setTimeout(() => {
      setActiveElement(defaultNavElement);
    }, 700);
  }
};

// update shape in storage when object is modified
export const handleCanvasObjectModified = ({ options, syncShapeInStorage }) => {
  const target = options.target;
  if (!target) return;

  if (target.type === "activeSelection") {
    // TODO: fix this if needed
  } else {
    syncShapeInStorage(target);
  }
};

// update shape in storage when path is created when in freeform mode
export const handlePathCreated = ({ options, syncShapeInStorage }) => {
  const path = options.path;
  if (!path) return;

  path.set({
    objectId: uuid4(),
  });

  syncShapeInStorage(path);
};

// check how object is moving on canvas and restrict it to canvas boundaries
export const handleCanvasObjectMoving = ({ options }) => {
  const target = options.target;
  if (!target) return;

  const canvas = target.canvas;

  target.setCoords();

  if (typeof target.left === "number") {
    target.left = Math.max(
      0,
      Math.min(
        target.left,
        (canvas.width || 0) - (target.getScaledWidth() || target.width || 0)
      )
    );
  }

  if (typeof target.top === "number") {
    target.top = Math.max(
      0,
      Math.min(
        target.top,
        (canvas.height || 0) - (target.getScaledHeight() || target.height || 0)
      )
    );
  }
};

// set element attributes when element is selected
export const handleCanvasSelectionCreated = ({
  options,
  isEditingRef,
  setElementAttributes,
}) => {
  if (isEditingRef.current || !options?.selected) return;

  const selectedElement = options.selected[0];

  if (selectedElement && options.selected.length === 1) {
    const scaledWidth = selectedElement.scaleX
      ? selectedElement.width * selectedElement.scaleX
      : selectedElement.width;

    const scaledHeight = selectedElement.scaleY
      ? selectedElement.height * selectedElement.scaleY
      : selectedElement.height;

    setElementAttributes({
      width: scaledWidth?.toFixed(0).toString() || "",
      height: scaledHeight?.toFixed(0).toString() || "",
      fill: selectedElement.fill?.toString() || "",
      stroke: selectedElement.stroke?.toString() || "",
      fontSize: selectedElement.fontSize || "",
      fontFamily: selectedElement.fontFamily || "",
      fontWeight: selectedElement.fontWeight || "",
    });
  }
};

// update element attributes when element is scaled
export const handleCanvasObjectScaling = ({
  options,
  setElementAttributes,
}) => {
  const selectedElement = options.target;

  const scaledWidth = selectedElement.scaleX
    ? selectedElement.width * selectedElement.scaleX
    : selectedElement.width;

  const scaledHeight = selectedElement.scaleY
    ? selectedElement.height * selectedElement.scaleY
    : selectedElement.height;

  setElementAttributes((prev) => ({
    ...prev,
    width: scaledWidth?.toFixed(0).toString() || "",
    height: scaledHeight?.toFixed(0).toString() || "",
  }));
};

// render canvas objects coming from storage on canvas
export const renderCanvas = ({ fabricRef, canvasObjects, activeObjectRef }) => {
  fabricRef.current?.clear();

  Array.from(canvasObjects, ([objectId, objectData]) => {
    fabric.util.enlivenObjects(
      [objectData],
      (enlivenedObjects) => {
        enlivenedObjects.forEach((enlivenedObj) => {
          if (activeObjectRef.current?.objectId === objectId) {
            fabricRef.current?.setActiveObject(enlivenedObj);
          }

          fabricRef.current?.add(enlivenedObj);
        });
      },
      "fabric"
    );
  });

  fabricRef.current?.renderAll();
};

// resize canvas dimensions on window resize
export const handleResize = ({ canvas }) => {
  const canvasElement = document.getElementById("canvas");
  if (!canvasElement || !canvas) return;

  canvas.setDimensions({
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
  });
};

// zoom canvas on mouse scroll
export const handleCanvasZoom = ({ options, canvas }) => {
  const delta = options.e?.deltaY;
  let zoom = canvas.getZoom();

  const minZoom = 0.2;
  const maxZoom = 1;
  const zoomStep = 0.001;

  zoom = Math.min(Math.max(minZoom, zoom + delta * zoomStep), maxZoom);

  canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom);

  options.e.preventDefault();
  options.e.stopPropagation();
};
