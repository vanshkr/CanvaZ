import { useMyPresence, useOthers } from "@liveblocks/react";
import React, { use, useEffect, useState } from "react";
import LiveCursors from "./cursor/LiveCursors";
import { CursorMode } from "@/types/type";
import CursorChat from "./cursor/CursorChat";

const Live = () => {
  const [{ cursor }, updateMyPresence] = useMyPresence();
  const [cursorState, setCursorState] = useState({ mode: CursorMode.Hidden });

  const handlePointerMove = (event) => {
    event.preventDefault();
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
    // Update the cursor position in the presence state
    updateMyPresence({ cursor: { x, y } });
  };
  const handlePointerLeave = () => {
    setCursorState({ mode: CursorMode.Hidden });
    // Clear the cursor position when the pointer leaves the area
    updateMyPresence({ cursor: null, message: null });
  };
  const handlePointerDown = (event) => {
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
    updateMyPresence({ cursor: { x, y } });
  };
  useEffect(() => {
    const onKeyUp = (e) => {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ cursor: null, message: null });
        setCursorState({ mode: CursorMode.Hidden });
      } else if (e.key === "e") {
        setCursorState({ mode: CursorMode.ReactionSelector });
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "/") {
        e.preventDefault();
      }
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);
  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className="h-[100vh] w-full flex flex-col items-center justify-center text-center bg-primary-grey-200"
    >
      {" "}
      <LiveCursors />
      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
    </div>
  );
};

export default Live;
