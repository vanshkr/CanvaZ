import React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const Avatar = ({ name, otherStyles }) => {
  const avatarUrl = `https://liveblocks.io/avatars/avatar-${Math.floor(
    Math.random() * 30
  )}.png`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`relative h-9 w-9 rounded-full overflow-hidden cursor-pointer ${otherStyles}`}
        >
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </TooltipTrigger>
      <TooltipContent className="border-none bg-gray-200 px-2.5 py-1.5 text-xs rounded-md">
        {name}
      </TooltipContent>
    </Tooltip>
  );
};

export default Avatar;
