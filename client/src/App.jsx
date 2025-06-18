import { useOthers } from "@liveblocks/react";
import Live from "./components/Live";
import Navbar from "./components/Navbar";
import LeftSidebar from "./components/LSidebar";
import RightSidebar from "./components/RightSidebar";
import { use, useEffect, useRef } from "react";
import { handleCanvasMouseDown, initializeFabric } from "./lib/canvas";

export function App() {
  const others = useOthers();
  const userCount = others.length;
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const shapeRef = useRef(null);
  const selectedShapeRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = initializeFabric(canvasRef, fabricRef, shapeRef);
    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        fabricRef,
        shapeRef,
        isDrawing,
      });
    });
  }, []);

  return (
    <main className="h-screen overflow-hidden">
      <Navbar />
      <section className="flex h-full flex-row">
        <LeftSidebar />
        <Live />
        <RightSidebar />
      </section>
    </main>
  );
}
