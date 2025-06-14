import { CursorMode } from "@/types/type";
import React from "react";
import CursorSVG from "@/assets/CursorSVG";

const CursorChat = ({
  cursor,
  cursorState,
  setCursorState,
  updateMyPresence,
}) => {
  const handleChange = (e) => {
    updateMyPresence({ message: e.target.value });
    setCursorState({
      mode: CursorMode.Chat,
      previousMessage: null,
      message: e.target.value,
    });
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setCursorState({
        mode: CursorChat.Chat,
        previousMessage: cursorState.message,
        message: "",
      });
    } else if (event.key === "Escape") {
      setCursorState({ mode: CursorMode.Hidden });
    }
  };
  return (
    <div
      className="absolute pointer-events-none left-0 top-0"
      style={{
        transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
      }}
    >
      {cursorState.mode === CursorMode.Chat && (
        <>
          <CursorSVG color="#000" />

          <div
            className="absolute left-2 top-5 bg-blue-500 px-4 py-2 text-sm leading-relaxed text-white"
            onKeyUp={(e) => e.stopPropagation()}
            style={{
              borderRadius: 20,
            }}
          >
            {cursorState.previousMessage && (
              <div>{cursorState.previousMessage}</div>
            )}
            <input
              className="z-10 w-60 border-none	bg-transparent text-white placeholder-blue-300 outline-none"
              autoFocus={true}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={cursorState.previousMessage ? "" : "Say something…"}
              value={cursorState.message}
              maxLength={50}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CursorChat;
