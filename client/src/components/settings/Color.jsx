import { Label } from "../ui/label";
import { Palette } from "lucide-react";

const Color = ({
  inputRef,
  attribute,
  placeholder,
  attributeType,
  handleInputChange,
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Palette className="w-4 h-4 text-slate-400" />
      <h4 className="text-xs font-medium text-slate-300 uppercase tracking-wide">{placeholder}</h4>
    </div>
    <div
      className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors"
      onClick={() => inputRef.current.click()}
    >
      <div 
        className="w-8 h-8 rounded-md border-2 border-slate-500 shadow-inner"
        style={{ backgroundColor: attribute || '#aabbcc' }}
      />
      <input
        type="color"
        value={attribute || '#aabbcc'}
        ref={inputRef}
        onChange={(e) => handleInputChange(attributeType, e.target.value)}
        className="sr-only"
      />
      <div className="flex-1">
        <Label className="text-sm text-white font-medium">{attribute || '#aabbcc'}</Label>
        <p className="text-xs text-slate-400">Click to change</p>
      </div>
    </div>
  </div>
);

export default Color;