import { useOthers } from "@liveblocks/react";
import Live from "./components/Live";

export function App() {
  const others = useOthers();
  const userCount = others.length;

  return (
    <div>
      <Live />
    </div>
  );
}
