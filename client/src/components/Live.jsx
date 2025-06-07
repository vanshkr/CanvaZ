import { useMyPresence, useOthers } from "@liveblocks/react";
import React, { use } from "react";
import LiveCursors from "./cursor/LiveCursors";

const Live = () => {
  const [{ cursor }, updateMyPresence] = useMyPresence();

  const handlePointerMove = (event) => {
    event.preventDefault();
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
    // Update the cursor position in the presence state
    updateMyPresence({ cursor: { x, y } });
  };
  const handlePointerLeave = () => {
    updateMyPresence({ cursor: null, message: null });
  };
  const handlePointerDown = (event) => {
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
    updateMyPresence({ cursor: { x, y } });
  };
  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className="h-[100vh] w-full flex flex-col items-center justify-center text-center bg-primary-grey-200"
    >
      <h1 className="text-2xl text-white">
        <LiveCursors />
      </h1>
    </div>
  );
};

export default Live;
