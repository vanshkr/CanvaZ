import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Maximize } from "lucide-react";

const dimensionsOptions = [
  { label: "Width", property: "width", unit: "px" },
  { label: "Height", property: "height", unit: "px" },
];

const Dimensions = ({ width, height, isEditingRef, handleInputChange }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Maximize className="w-4 h-4 text-slate-400" />
      <h4 className="text-xs font-medium text-slate-300 uppercase tracking-wide">Dimensions</h4>
    </div>
    
    <div className="grid grid-cols-2 gap-3">
      {dimensionsOptions.map((item) => (
        <div key={item.label} className="space-y-2">
          <Label htmlFor={item.property} className="text-xs text-slate-400 font-medium">
            {item.label}
          </Label>
          <div className="relative">
            <Input
              type="number"
              id={item.property}
              placeholder="100"
              value={item.property === "width" ? width : height}
              className="bg-slate-800 border-slate-600 text-white pr-8"
              min={1}
              onChange={(e) => handleInputChange(item.property, e.target.value)}
              onBlur={() => {
                isEditingRef.current = false;
              }}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-400">
              {item.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Dimensions;