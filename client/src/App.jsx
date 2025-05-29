import { useOthers } from "@liveblocks/react";

export function App() {
  const others = useOthers();
  const userCount = others.length;

  return (
    <div className="h-[100vh] w-full flex flex-col items-center justify-center text-center bg-primary-grey-200">
      <h1 className="text-2xl text-white">Liveblocks figma clone</h1>
    </div>
  );
}
