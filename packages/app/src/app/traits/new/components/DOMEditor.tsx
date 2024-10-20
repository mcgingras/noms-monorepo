"use client";

import { useCallback, useState, useEffect } from "react";
import { DrawMode } from "../hooks/usePixelGrid";
import useDebouncedQuery from "@/hooks/useDebouncedQuery";
import { useTraitEditorContext } from "@/stores/traitEditor/context";
import RenderingNom from "@/components/RenderingNom";

// Create the checkerboard pattern SVG
const checkerboardPattern = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4">
  <rect width="2" height="2" fill="#e0e0e0"/>
  <rect x="2" width="2" height="2" fill="#ffffff"/>
  <rect y="2" width="2" height="2" fill="#ffffff"/>
  <rect x="2" y="2" width="2" height="2" fill="#e0e0e0"/>
</svg>
`);

const DOMEditor = ({
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
  const updateCustomLayerWithGridDetails = useTraitEditorContext(
    (state) => state.updateCustomLayerWithGridDetails
  );
  const editorLayers = useTraitEditorContext((state) => state.editorLayers);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoveredPixel, setHoveredPixel] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleMouseDown = useCallback(
    (x: number, y: number) => {
      setIsDrawing(true);
      startDraw();
      draw(x, y);
    },
    [startDraw, draw]
  );

  const handleMouseUp = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      endDraw();
    }
  }, [isDrawing, endDraw]);

  const handleMouseMove = useCallback(
    (x: number, y: number) => {
      setHoveredPixel({ x, y });
      if (isDrawing) {
        draw(x, y);
      }
    },
    [isDrawing, draw]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredPixel(null);
    handleMouseUp();
  }, [handleMouseUp]);

  const debouncedGrid = useDebouncedQuery(grid, 500);
  useEffect(() => {
    updateCustomLayerWithGridDetails(debouncedGrid);
  }, [debouncedGrid]);

  return (
    <div className="p-4 w-full h-full flex flex-col items-center justify-center">
      <div className="min-w-[400px] w-1/2 aspect-square relative">
        <div className="absolute inset-0 z-10 pointer-events-none">
          <RenderingNom layers={editorLayers} />
        </div>
        <div
          className="block relative"
          style={{
            backgroundImage: `url("data:image/svg+xml,${checkerboardPattern}")`,
            backgroundSize: "3.125%",
            imageRendering: "pixelated",
          }}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {grid.map((row, y) => (
            <div key={`row-${y}`} className={`w-full h-[3.125%] flex flex-row`}>
              {row.map((pixelColor, x) => (
                <div
                  key={x}
                  className={`w-[3.125%] aspect-square relative transition-colors duration-150 z-20`}
                  style={{
                    backgroundColor:
                      pixelColor !== "#ffffff" ? pixelColor : "transparent",
                  }}
                  onMouseDown={() => handleMouseDown(x, y)}
                  onMouseMove={() => handleMouseMove(x, y)}
                >
                  {hoveredPixel &&
                    hoveredPixel.x === x &&
                    hoveredPixel.y === y && (
                      <div
                        className="absolute inset-0 pointer-events-none w-full h-full bg-black/30"
                        style={{
                          zIndex: 30,
                        }}
                      />
                    )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DOMEditor;
