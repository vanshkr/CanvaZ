import { useMemo } from "react";
import { generateRandomName } from "@/lib/utils";
import { useOthers, useSelf } from "@liveblocks/react";
import Avatar from "./Avatar";
import { Users } from "lucide-react";

const ActiveUsers = () => {
  const others = useOthers();
  const currentUser = useSelf();
  
  const memoizedUsers = useMemo(() => {
    const hasMoreUsers = others.length > 3;
    const visibleOthers = others.slice(0, 3);

    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-slate-300">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">
            {others.length + 1} online
          </span>
        </div>
        
        <div className="flex items-center">
          {currentUser && (
            <Avatar 
              name="You" 
              otherStyles="border-2 border-blue-500 shadow-lg shadow-blue-500/25" 
            />
          )}

          {visibleOthers.map(({ connectionId }) => (
            <Avatar
              key={connectionId}
              name={generateRandomName()}
              otherStyles="-ml-2 border-2 border-slate-600"
            />
          ))}

          {hasMoreUsers && (
            <div className="z-10 -ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 border-2 border-slate-600 text-xs font-medium text-white">
              +{others.length - 3}
            </div>
          )}
        </div>
      </div>
    );
  }, [others.length]);

  return memoizedUsers;
};

export default ActiveUsers;