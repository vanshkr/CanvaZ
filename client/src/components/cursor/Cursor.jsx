import React from "react";
import CursorSVG from "@/assets/CursorSVG";
const Cursor = ({ color, x, y, message }) => {
  return (
    <div
      className="absolute pointer-events-none left-0 top-0"
      style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
    >
      <CursorSVG color={color} />
    </div>
  );
};

export default Cursor;
