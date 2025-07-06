import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getShapeInfo } from "@/lib/utils";
import { Layers, Eye, EyeOff, Lock, Unlock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const LeftSidebar = ({ allShapes, onSelectShape, onDeleteShape, selectedShapeId }) => {
  const [hiddenShapes, setHiddenShapes] = useState(new Set());
  const [lockedShapes, setLockedShapes] = useState(new Set());

  const toggleVisibility = (shapeId, e) => {
    e.stopPropagation();
    setHiddenShapes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shapeId)) {
        newSet.delete(shapeId);
      } else {
        newSet.add(shapeId);
      }
      return newSet;
    });
  };

  const toggleLock = (shapeId, e) => {
    e.stopPropagation();
    setLockedShapes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shapeId)) {
        newSet.delete(shapeId);
      } else {
        newSet.add(shapeId);
      }
      return newSet;
    });
  };

  const handleDelete = (shapeId, e) => {
    e.stopPropagation();
    onDeleteShape?.(shapeId);
  };

  return (
    <aside className="min-w-[280px] sticky left-0 top-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200 max-sm:hidden select-none border-r border-slate-700 shadow-xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Layers</h3>
          <span className="ml-auto text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
            {allShapes?.length || 0}
          </span>
        </div>
      </div>

      {/* Scrollable list */}
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-2">
          {allShapes?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Layers className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">No layers yet</p>
              <p className="text-xs opacity-70">Start creating shapes</p>
            </div>
          ) : (
            <div className="space-y-1">
              {allShapes?.map((shape, index) => {
                const info = getShapeInfo(shape[1]?.type);
                const shapeId = shape[1]?.objectId;
                const isSelected = selectedShapeId === shapeId;
                const isHidden = hiddenShapes.has(shapeId);
                const isLocked = lockedShapes.has(shapeId);

                return (
                  <div
                    key={shapeId}
                    onClick={() => onSelectShape?.(shapeId)}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-700/50 ${
                      isSelected 
                        ? "bg-blue-500/20 border border-blue-500/30 shadow-lg" 
                        : "hover:bg-slate-700/30"
                    } ${isHidden ? "opacity-50" : ""}`}
                  >
                    {/* Shape Icon */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${
                      isSelected ? "bg-blue-500/30" : "bg-slate-700/50"
                    }`}>
                      <img
                        src={info?.icon}
                        alt="Layer"
                        width={16}
                        height={16}
                        className={`${isSelected ? "brightness-125" : "opacity-70"} transition-all`}
                      />
                    </div>

                    {/* Shape Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-medium capitalize truncate ${
                        isSelected ? "text-white" : "text-slate-200"
                      }`}>
                        {info.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Layer {allShapes.length - index}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => toggleVisibility(shapeId, e)}
                        className="w-6 h-6 p-0 hover:bg-slate-600"
                      >
                        {isHidden ? (
                          <EyeOff className="w-3 h-3 text-slate-400" />
                        ) : (
                          <Eye className="w-3 h-3 text-slate-300" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => toggleLock(shapeId, e)}
                        className="w-6 h-6 p-0 hover:bg-slate-600"
                      >
                        {isLocked ? (
                          <Lock className="w-3 h-3 text-slate-400" />
                        ) : (
                          <Unlock className="w-3 h-3 text-slate-300" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDelete(shapeId, e)}
                        className="w-6 h-6 p-0 hover:bg-red-500/20 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default LeftSidebar;