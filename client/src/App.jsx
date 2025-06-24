import { useOthers, useStorage, useMutation } from "@liveblocks/react";
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
  handleResize,
  initializeFabric,
  renderCanvas,
} from "./lib/canvas";
import { handleDelete } from "./lib/key-events";
import { defaultNavElement } from "@/constants";

export function App() {
  const others = useOthers();
  const userCount = others.length;
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const shapeRef = useRef(null);
  const selectedShapeRef = useRef(null);
  const isDrawing = useRef(false);
  const [activeElement, setActiveElement] = useState({
    name: "",
    value: "",
    icon: "",
  });
  const activeObjectRef = useRef(null);

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

    const handleResizeEvent = () => {
      handleResize({ fabricRef });
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);
    canvas.on("object:modified", handleObjectModified);
    window.addEventListener("resize", handleResizeEvent);

    return () => {
      canvas.dispose();
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
      canvas.off("object:modified", handleObjectModified);
      window.removeEventListener("resize", handleResizeEvent);
    };
  }, []);

  useEffect(() => {
    renderCanvas({ fabricRef, canvasObjects, activeObjectRef });
  }, [canvasObjects]);

  return (
    <main className="h-screen overflow-hidden">
      <Navbar
        handleActiveElement={handleActiveElement}
        activeElement={activeElement}
      />
      <section className="flex h-full flex-row">
        <LeftSidebar allShapes={Array.from(canvasObjects)} />
        <Live canvasRef={canvasRef} />
        <RightSidebar />
      </section>
    </main>
  );
}
