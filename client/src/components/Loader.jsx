import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      {/* You can use your own loader.gif if you want */}
      <img
        src="/assets/loader.gif"
        alt="Loading..."
        className="w-24 h-24 object-contain"
      />
      <p className="text-sm font-bold text-muted-foreground">Loading...</p>
    </div>
  );
};

export default Loader;
