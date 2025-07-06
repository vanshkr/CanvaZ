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
          className={`relative h-9 w-9 rounded-full overflow-hidden cursor-pointer transition-transform hover:scale-110 ${otherStyles}`}
        >
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover rounded-full"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-slate-800 border-slate-700 text-white">
        {name}
      </TooltipContent>
    </Tooltip>
  );
};

export default Avatar;