import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.jsx";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LiveblocksProvider publicApiKey={import.meta.env.VITE_LIVEBLOCKS_KEY}>
      <RoomProvider id="my-room">
        <App />
      </RoomProvider>
    </LiveblocksProvider>
  </StrictMode>
);
