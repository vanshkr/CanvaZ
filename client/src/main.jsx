import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.jsx";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react";
import { LiveMap } from "@liveblocks/client";
import Loader from "./components/Loader";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LiveblocksProvider publicApiKey={import.meta.env.VITE_LIVEBLOCKS_KEY}>
      <RoomProvider
        id="my-room"
        initialPresence={{
          cursor: null,
          cursorColor: null,
          editingText: null,
        }}
        initialStorage={{ canvasObjects: new LiveMap() }}
      >
        <ClientSideSuspense fallback={<Loader />}>
          {() => <App />}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  </StrictMode>
);
