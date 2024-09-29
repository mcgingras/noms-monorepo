import PaintbrushIcon from "@/components/icons/Paintbrush";
import UndoIcon from "@/components/icons/Undo";
import TrashIcon from "@/components/icons/Trash";
import { DrawMode } from "../hooks/usePixelGrid";

const Toolbox = ({
  grid,
  startDraw,
  draw,
  endDraw,
  setBrushSize,
  setDrawMode,
  undo,
  redo,
  clear,
  brushSize,
  drawMode,
}: {
  grid: string[][];
  startDraw: () => void;
  draw: (x: number, y: number) => void;
  endDraw: () => void;
  setBrushSize: (size: number) => void;
  setDrawMode: (mode: DrawMode) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  brushSize: number;
  drawMode: DrawMode;
}) => {
  return (
    <div className="h-full w-full p-2 overflow-hidden flex flex-col">
      <h3 className="text-white text-lg oziksoft">Preview</h3>
      <div className="w-full aspect-square bg-gray-900 mt-1 ml-[2px]"></div>
      <h3 className="text-white text-lg oziksoft mt-2">Tools</h3>
      <div className="grid grid-cols-3 gap-2 mt-2 flex-1">
        <div className="h-full flex flex-col justify-between">
          <div className="h-1/3 w-full rounded-2xl bg-gray-900"></div>
          <button
            className="w-full aspect-square bg-gray-900 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-1000"
            onClick={clear}
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col space-y-4 items-center">
          <button className="p-2 rounded-md">
            <PaintbrushIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col space-y-4 items-center">
          <button className="p-2 rounded-md" onClick={undo}>
            <UndoIcon />
          </button>
          <button className="p-2 rounded-md" onClick={redo}>
            <UndoIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbox;
