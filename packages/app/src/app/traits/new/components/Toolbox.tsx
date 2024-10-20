import PaintbrushIcon from "@/components/icons/Paintbrush";
import UndoIcon from "@/components/icons/Undo";
import TrashIcon from "@/components/icons/Trash";
import RedoIcon from "@/components/icons/Redo";
import CircleIcon from "@/components/icons/Circle";
import LineIcon from "@/components/icons/Line";
import SquareIcon from "@/components/icons/Square";
import PaintbucketIcon from "@/components/icons/Paintbucket";
import EraserIcon from "@/components/icons/Eraser";
import { DrawMode } from "../hooks/usePixelGrid";
import { useTraitEditorContext } from "@/stores/traitEditor/context";
import RenderingNom from "@/components/RenderingNom";

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
  const layers = useTraitEditorContext((state) => state.layers);

  return (
    <div className="h-full w-full p-2 overflow-hidden flex flex-col">
      <h3 className="text-white text-lg oziksoft">Preview</h3>
      <div className="w-full aspect-square bg-gray-900 mt-1 ml-[2px] rounded-lg">
        <RenderingNom layers={layers} />
      </div>
      <h3 className="text-white text-lg oziksoft mt-2">Tools</h3>
      <div className="flex-1 rounded-lg mt-1 flex flex-col">
        <div className="grid grid-cols-3 gap-x-4 p-2 bg-gray-900 rounded-lg">
          <div
            className="rounded-lg aspect-square flex items-center justify-center hover:bg-gray-1000 transition-colors"
            onClick={() => {
              setBrushSize(1);
            }}
          >
            <PaintbrushIcon className="h-5 w-5" />
          </div>
          <div
            className="rounded-lg aspect-square flex items-center justify-center hover:bg-gray-1000 transition-colors"
            onClick={() => {
              setBrushSize(2);
            }}
          >
            <PaintbrushIcon className="h-7 w-7" />
          </div>
          <div
            className="rounded-lg aspect-square flex items-center justify-center hover:bg-gray-1000 transition-colors"
            onClick={() => {
              setBrushSize(3);
            }}
          >
            <PaintbrushIcon className="h-9 w-9" />
          </div>
        </div>
        <div className="grid grid-cols-2 px-8 rounded-lg mt-2 gap-2">
          <div className="rounded-lg aspect-square flex items-center justify-center transition-colors">
            <PaintbrushIcon className="h-8 w-8 text-[#B7B7B7] hover:text-white cursor-pointer transition-all" />
          </div>
          <div className="rounded-lg aspect-square flex items-center justify-center transition-colors">
            <EraserIcon className="h-8 w-8 text-[#B7B7B7] hover:text-white cursor-pointer transition-all" />
          </div>
          <div className="rounded-lg aspect-square flex items-center justify-center transition-colors">
            <PaintbucketIcon className="h-8 w-8 text-[#B7B7B7] hover:text-white cursor-pointer transition-all" />
          </div>
          <div className="rounded-lg aspect-square flex items-center justify-center transition-colors">
            <LineIcon className="h-8 w-8 text-[#B7B7B7] hover:text-white cursor-pointer transition-all" />
          </div>
          <div className="rounded-lg aspect-square flex items-center justify-center transition-colors">
            <CircleIcon className="h-8 w-8 text-[#B7B7B7] hover:text-white cursor-pointer transition-all" />
          </div>
          <div className="rounded-lg aspect-square flex items-center justify-center transition-colors">
            <SquareIcon className="h-8 w-8 text-[#B7B7B7] hover:text-white cursor-pointer transition-all" />
          </div>
          <div
            className="rounded-lg aspect-square flex items-center justify-center transition-colors"
            onClick={undo}
          >
            <UndoIcon className="h-8 w-8 text-[#B7B7B7] hover:text-white cursor-pointer transition-all" />
          </div>
          <div
            className="rounded-lg aspect-square flex items-center justify-center transition-colors"
            onClick={redo}
          >
            <RedoIcon className="h-8 w-8 text-[#B7B7B7] hover:text-white cursor-pointer transition-all" />
          </div>
        </div>
        <div className="flex-1 min-h-2 block w-full"></div>
        {/* This empty div will push the button to the bottom */}
        <button
          className="w-full bg-gray-900 text-center rounded-lg font-bold pangram-sans flex items-center justify-center gap-2 py-2 mt-auto ring-0 ring-offset-0 ring-gray-900 hover:ring-2 transition-all"
          onClick={() => {
            clear();
          }}
        >
          <TrashIcon className="h-5 w-5" />
          <span>Clear canvas</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbox;
