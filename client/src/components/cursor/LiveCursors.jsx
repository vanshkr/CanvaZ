import { useOthersMapped } from "@liveblocks/react";
import Cursor from "./Cursor";
import { COLORS } from "../../constants/index.js";
import React from "react";

const LiveCursors = () => {
  const cursors = useOthersMapped((other) =>
    other?.presence?.cursor ? (
      <Cursor
        key={other.connectionId}
        color={COLORS[Number(other.connectionId) % COLORS.length]}
        x={other.presence.cursor.x}
        y={other.presence.cursor.y}
        message={other.presence.message}
      />
    ) : null
  );
  return <>{cursors}</>;
};

export default LiveCursors;
