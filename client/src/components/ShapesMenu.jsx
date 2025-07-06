import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const ShapesMenu = ({
  item,
  activeElement,
  handleActiveElement,
  handleImageUpload,
  imageInputRef,
}) => {
  const isDropdownElem = item.value.some(
    (elem) => elem?.value === activeElement?.value
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="relative h-8 w-8 p-0 bg-transparent hover:bg-slate-700 border-none"
            onClick={() => handleActiveElement(item)}
          >
            <img
              src={isDropdownElem ? activeElement?.icon : item.icon}
              alt={item.name}
              className={`w-5 h-5 object-contain transition-all ${
                isDropdownElem ? "invert brightness-0" : "opacity-70"
              }`}
            />
            <ChevronDown className="w-3 h-3 absolute -bottom-1 -right-1 text-slate-400" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mt-2 bg-slate-800 border-slate-700 shadow-xl rounded-lg overflow-hidden">
          <div className="p-2 space-y-1">
            {item.value.map((elem) => (
              <Button
                key={elem?.name}
                onClick={() => handleActiveElement(elem)}
                className={`w-full flex items-center justify-start gap-3 rounded-md px-3 py-2 text-left transition-all ${
                  activeElement?.value === elem?.value
                    ? "bg-blue-500 text-white"
                    : "text-slate-200 hover:bg-slate-700"
                }`}
              >
                <img
                  src={elem?.icon}
                  alt={elem?.name}
                  width={18}
                  height={18}
                  className={`object-contain ${
                    activeElement?.value === elem?.value ? "invert brightness-0" : ""
                  }`}
                />
                <span className="text-sm font-medium">{elem?.name}</span>
              </Button>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        type="file"
        className="hidden"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleImageUpload}
      />
    </>
  );
};

export default ShapesMenu;