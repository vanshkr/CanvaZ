import { exportToPdf } from "@/lib/utils";
import { Download, FileImage, FileText } from "lucide-react";
import { Button } from "../ui/button";

const Export = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-2">
      <Download className="w-4 h-4 text-blue-400" />
      <h3 className="text-sm font-semibold text-white">Export Options</h3>
    </div>
    
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full justify-start gap-3 bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
        onClick={exportToPdf}
      >
        <FileText className="w-4 h-4" />
        Export as PDF
      </Button>
      
      <Button
        variant="outline"
        className="w-full justify-start gap-3 bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
        onClick={() => {
          const canvas = document.querySelector("canvas");
          if (!canvas) return;
          
          const link = document.createElement("a");
          link.download = "design.png";
          link.href = canvas.toDataURL();
          link.click();
        }}
      >
        <FileImage className="w-4 h-4" />
        Export as PNG
      </Button>
      
      <Button
        variant="outline"
        className="w-full justify-start gap-3 bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
        onClick={() => {
          const canvas = document.querySelector("canvas");
          if (!canvas) return;
          
          const link = document.createElement("a");
          link.download = "design.jpg";
          link.href = canvas.toDataURL("image/jpeg", 0.9);
          link.click();
        }}
      >
        <FileImage className="w-4 h-4" />
        Export as JPG
      </Button>
    </div>
    
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <p className="text-xs text-slate-400 leading-relaxed">
        Export your design in various formats. PDF is recommended for print, PNG for web with transparency, and JPG for smaller file sizes.
      </p>
    </div>
  </div>
);

export default Export;