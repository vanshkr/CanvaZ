import React, { memo } from "react";
import { navElements } from "@/constants";
import { Undo2, Redo2, Download, Upload, Save, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import ShapesMenu from "./ShapesMenu";
import ActiveUsers from "./users/ActiveUsers";
import { NewThread } from "./comments/NewThread";

const Navbar = ({
  activeElement,
  imageInputRef,
  handleImageUpload,
  handleActiveElement,
  undo,
  redo,
  canUndo,
  canRedo,
}) => {
  const isActive = (value) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) &&
      value.some((val) => val?.value === activeElement?.value));

  return (
    <nav className="flex select-none items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-3 text-white shadow-xl border-b border-slate-700">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            DesignPro
          </span>
        </div>
      </div>

      {/* Main Tools */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 mr-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            className="text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
            className="text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Tool Buttons */}
        <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
          {navElements.map((item) => (
            <div
              key={item.name}
              onClick={() => {
                if (Array.isArray(item.value)) return;
                handleActiveElement(item);
              }}
              className={`group relative flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200 cursor-pointer
                ${
                  isActive(item.value)
                    ? "bg-blue-500 shadow-lg shadow-blue-500/25"
                    : "hover:bg-slate-700"
                }
              `}
            >
              {Array.isArray(item.value) ? (
                <ShapesMenu
                  item={item}
                  activeElement={activeElement}
                  imageInputRef={imageInputRef}
                  handleActiveElement={handleActiveElement}
                  handleImageUpload={handleImageUpload}
                />
              ) : item?.value === "comments" ? (
                <NewThread>
                  <Button className="relative w-6 h-6 p-0 bg-transparent hover:bg-transparent">
                    <img
                      src={item.icon}
                      alt={item.name}
                      className={`w-5 h-5 object-contain transition-all ${
                        isActive(item.value) ? "invert brightness-0" : "opacity-70 group-hover:opacity-100"
                      }`}
                    />
                  </Button>
                </NewThread>
              ) : (
                <img
                  src={item.icon}
                  alt={item.name}
                  className={`w-5 h-5 object-contain transition-all ${
                    isActive(item.value) ? "invert brightness-0" : "opacity-70 group-hover:opacity-100"
                  }`}
                />
              )}
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.name}
              </div>
            </div>
          ))}
        </div>

        {/* File Actions */}
        <div className="flex items-center gap-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <ActiveUsers />
      </div>
    </nav>
  );
};

export default memo(
  Navbar,
  (prevProps, nextProps) => 
    prevProps.activeElement === nextProps.activeElement &&
    prevProps.canUndo === nextProps.canUndo &&
    prevProps.canRedo === nextProps.canRedo
);