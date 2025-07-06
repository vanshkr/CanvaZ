import React, { useRef, useState } from "react";
import { Settings, Palette, Type, Move, RotateCw, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Color from "./settings/Color";
import Dimensions from "./settings/Dimensions";
import Text from "./settings/Text";
import Export from "./settings/Export";

const RightSidebar = ({ 
  elementAttributes,
  setElementAttributes,
  fabricRef,
  isEditingRef,
  activeObjectRef,
  syncShapeInStorage 
}) => {
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("properties");

  const handleInputChange = (property, value) => {
    if (!isEditingRef.current) isEditingRef.current = true;

    setElementAttributes((prev) => ({
      ...prev,
      [property]: value,
    }));

    modifyShape({
      canvas: fabricRef.current,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage,
    });
  };

  const modifyShape = ({ canvas, property, value, activeObjectRef, syncShapeInStorage }) => {
    const selectedElement = canvas.getActiveObject();
    if (!selectedElement || selectedElement.type === "activeSelection") return;

    if (property === "width") {
      selectedElement.set("scaleX", 1);
      selectedElement.set("width", value);
    } else if (property === "height") {
      selectedElement.set("scaleY", 1);
      selectedElement.set("height", value);
    } else {
      if (selectedElement[property] === value) return;
      selectedElement.set(property, value);
    }

    activeObjectRef.current = selectedElement;
    canvas.renderAll();
    syncShapeInStorage(selectedElement);
  };

  const tabs = [
    { id: "properties", label: "Properties", icon: Settings },
    { id: "design", label: "Design", icon: Palette },
    { id: "export", label: "Export", icon: Copy },
  ];

  return (
    <section className="flex flex-col border-l border-slate-700 bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200 w-[320px] min-w-[320px] max-sm:hidden select-none sticky right-0 h-full shadow-xl">
      {/* Header with Tabs */}
      <div className="border-b border-slate-700 bg-slate-800/50">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "text-white bg-slate-700 border-b-2 border-blue-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "properties" && (
          <div className="space-y-6 p-6">
            {/* Position & Size */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Move className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Position & Size</h3>
              </div>
              
              <Dimensions
                width={elementAttributes.width}
                height={elementAttributes.height}
                isEditingRef={isEditingRef}
                handleInputChange={handleInputChange}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-slate-400 mb-1 block">X Position</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-400 mb-1 block">Y Position</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-slate-400 mb-1 block">Rotation</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="0"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Colors</h3>
              </div>

              <Color
                inputRef={colorInputRef}
                attribute={elementAttributes.fill}
                placeholder="Fill Color"
                attributeType="fill"
                handleInputChange={handleInputChange}
              />

              <Color
                inputRef={strokeInputRef}
                attribute={elementAttributes.stroke}
                placeholder="Stroke Color"
                attributeType="stroke"
                handleInputChange={handleInputChange}
              />
            </div>

            {/* Typography */}
            {elementAttributes.fontSize && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Type className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-white">Typography</h3>
                </div>

                <Text
                  fontFamily={elementAttributes.fontFamily}
                  fontSize={elementAttributes.fontSize}
                  fontWeight={elementAttributes.fontWeight}
                  handleInputChange={handleInputChange}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "design" && (
          <div className="space-y-6 p-6">
            <div className="text-center py-12 text-slate-400">
              <Palette className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Advanced design tools</p>
              <p className="text-xs opacity-70">Coming soon</p>
            </div>
          </div>
        )}

        {activeTab === "export" && (
          <div className="p-6">
            <Export />
          </div>
        )}
      </div>
    </section>
  );
};

export default RightSidebar;