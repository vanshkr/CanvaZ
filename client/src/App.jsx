import {
  useOthers,
  useStorage,
  useMutation,
  useUndo,
  useRedo,
  useCanUndo,
  useCanRedo,
} from "@liveblocks/react";
import Live from "./components/Live";
import Navbar from "./components/Navbar";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import { useState, useEffect, useRef } from "react";
import {
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasMouseMove,
  handleCanvasObjectModified,
  handleCanvasSelectionCreated,
  handleCanvasObjectScaling,
  handleResize,
  initializeFabric,
  renderCanvas,
} from "./lib/canvas";
import { handleDelete, handleKeyDown } from "./lib/key-events";
import { defaultNavElement } from "@/constants";
import { handleImageUpload } from "./lib/shapes";

export function App() {
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const others = useOthers();
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const shapeRef = useRef(null);
  const selectedShapeRef = useRef(null);
  const isDrawing = useRef(false);
  const isEditingRef = useRef(false);
  const imageInputRef = useRef(null);
  const activeObjectRef = useRef(null);
  
  const [activeElement, setActiveElement] = useState({
    name: "",
    value: "",
    icon: "",
  });
  
  const [elementAttributes, setElementAttributes] = useState({
    width: "",
    height: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    fill: "#aabbcc",
    stroke: "#aabbcc",
  });

  const [selectedShapeId, setSelectedShapeId] = useState(null);

  const canvasObjects = useStorage((root) => root.canvasObjects);

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return;

    const { objectId } = object;
    const shapeData = object.toJSON();
    shapeData.objectId = objectId;
    const canvaObjects = storage.get("canvasObjects");
    canvaObjects.set(objectId, shapeData);
  }, []);

  const handleActiveElement = (element) => {
    setActiveElement(element);

    switch (element?.value) {
      case "reset":
        deleteAllShapes();
        fabricRef.current.clear();
        setActiveElement(defaultNavElement);
        break;
      case "delete":
        handleDelete(fabricRef.current, deleteShapeFromStorage);
        setActiveElement(defaultNavElement);
        break;
      case "image":
        imageInputRef.current?.click();
        isDrawing.current = false;

        if (fabricRef.current) {
          fabricRef.current.isDrawingMode = false;
        }
        break;
      case "comments":
        break;
      default:
        selectedShapeRef.current = element?.value;
        break;
    }
  };

  const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.delete(shapeId);
  }, []);

  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get("canvasObjects");
    if (!canvasObjects || canvasObjects.size === 0) return true;

    for (const [key] of canvasObjects) {
      canvasObjects.delete(key);
    }
    return canvasObjects.size === 0;
  }, []);

  const handleImage = (e) => {
    e.stopPropagation();
    handleImageUpload({
      file: e.target.files[0],
      canvas: fabricRef,
      shapeRef,
      syncShapeInStorage,
    });
  };

  const handleSelectShape = (shapeId) => {
    setSelectedShapeId(shapeId);
    // Additional logic to select shape on canvas
  };

  const handleDeleteShape = (shapeId) => {
    deleteShapeFromStorage(shapeId);
    if (selectedShapeId === shapeId) {
      setSelectedShapeId(null);
    }
  };

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });

    const handleMouseDown = (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        fabricRef,
        shapeRef,
        selectedShapeRef,
        isDrawing,
      });
    };

    const handleMouseMove = (options) => {
      handleCanvasMouseMove({
        options,
        canvas,
        fabricRef,
        shapeRef,
        selectedShapeRef,
        isDrawing,
        syncShapeInStorage,
      });
    };

    const handleMouseUp = (options) => {
      handleCanvasMouseUp({
        canvas,
        shapeRef,
        selectedShapeRef,
        isDrawing,
        syncShapeInStorage,
        setActiveElement,
        activeObjectRef,
      });
    };

    const handleObjectModified = (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      });
    };

    const handleSelectionCreated = (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      });
    };

    const handleObjectScaling = (options) => {
      handleCanvasObjectScaling({
        options,
        setElementAttributes,
      });
    };

    const handleResizeEvent = () => {
      handleResize({ canvas: fabricRef.current });
    };

    const handleUndoRedoEvent = (e) => {
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
      });
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);
    canvas.on("object:modified", handleObjectModified);
    canvas.on("selection:created", handleSelectionCreated);
    canvas.on("selection:updated", handleSelectionCreated);
    canvas.on("object:scaling", handleObjectScaling);
    window.addEventListener("resize", handleResizeEvent);
    window.addEventListener("keydown", (e) => handleUndoRedoEvent(e));

    return () => {
      canvas.dispose();
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
      canvas.off("object:modified", handleObjectModified);
      canvas.off("selection:created", handleSelectionCreated);
      canvas.off("selection:updated", handleSelectionCreated);
      canvas.off("object:scaling", handleObjectScaling);
      window.removeEventListener("resize", handleResizeEvent);
      window.removeEventListener("keydown", handleUndoRedoEvent);
    };
  }, []);

  useEffect(() => {
    renderCanvas({ fabricRef, canvasObjects, activeObjectRef });
  }, [canvasObjects]);

  return (
    <main className="h-screen overflow-hidden bg-slate-900">
      <Navbar
        handleActiveElement={handleActiveElement}
        activeElement={activeElement}
        handleImageUpload={(e) => handleImage(e)}
        imageInputRef={imageInputRef}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <section className="flex h-full flex-row">
        <LeftSidebar
          allShapes={canvasObjects ? Array.from(canvasObjects) : []}
          onSelectShape={handleSelectShape}
          onDeleteShape={handleDeleteShape}
          selectedShapeId={selectedShapeId}
        />

        <Live canvasRef={canvasRef} />
        
        <RightSidebar
          elementAttributes={elementAttributes}
          setElementAttributes={setElementAttributes}
          fabricRef={fabricRef}
          isEditingRef={isEditingRef}
          activeObjectRef={activeObjectRef}
          syncShapeInStorage={syncShapeInStorage}
        />
      </section>
    </main>
  );
}