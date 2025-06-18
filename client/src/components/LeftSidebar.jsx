import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getShapeInfo } from "@/lib/utils";

const LeftSidebar = ({ allShapes }) => {
  return (
    <aside className="min-w-[227px] sticky left-0 top-0 h-full bg-primary-black text-primary-grey-300 max-sm:hidden select-none border-r border-primary-grey-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-primary-grey-200">
        <h3 className="text-xs font-medium uppercase tracking-wide">Layers</h3>
      </div>

      {/* Scrollable list */}
      <ScrollArea className="h-[calc(100vh-3.5rem)] pb-20">
        <div className="flex flex-col">
          {allShapes?.map((shape) => {
            const info = getShapeInfo(shape[1]?.type);

            return (
              <div
                key={shape[1]?.objectId}
                className="group my-1 flex items-center gap-2 px-5 py-2.5 cursor-pointer hover:bg-primary-green hover:text-primary-black"
              >
                <img
                  src={info?.icon}
                  alt="Layer"
                  width={16}
                  height={16}
                  className="group-hover:invert"
                />
                <h3 className="text-sm font-semibold capitalize">
                  {info.name}
                </h3>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default LeftSidebar;
