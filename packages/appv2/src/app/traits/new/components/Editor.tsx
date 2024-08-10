"use client";
import React, { useRef, useEffect, useState } from "react";

const Editor = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [cellSize, setCellSize] = useState(16);

  const GRID_SIZE = 32;
  const PADDING_SIZE = 16;

  useEffect(() => {
    const resizeCanvas = () => {
      if (containerRef.current && canvasRef.current) {
        const containerWidth =
          containerRef.current.clientWidth - PADDING_SIZE * 2;
        const containerHeight =
          containerRef.current.clientHeight - PADDING_SIZE * 2;
        console.log(containerWidth, containerHeight);
        const size = Math.min(containerWidth, containerHeight);
        const newCellSize = Math.floor(size / GRID_SIZE);

        setCellSize(newCellSize);
        canvasRef.current.width = newCellSize * GRID_SIZE;
        canvasRef.current.height = newCellSize * GRID_SIZE;

        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = false;
          drawGrid(ctx, newCellSize);
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const drawGrid = (ctx: CanvasRenderingContext2D, cellSize: number) => {
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      const position = i * cellSize - 0.5;
      ctx.beginPath();
      ctx.moveTo(position, 0);
      ctx.lineTo(position, GRID_SIZE * cellSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, position);
      ctx.lineTo(GRID_SIZE * cellSize, position);
      ctx.stroke();
    }
  };

  const getCellCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    return { x, y };
  };

  const fillCell = (x: number, y: number, color: string) => {
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    // ctx.strokeStyle = "#ddd";
    // ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCellCoordinates(e);
    if (x !== hoveredCell?.x || y !== hoveredCell?.y) {
      if (hoveredCell && !isDrawing) {
        fillCell(hoveredCell.x, hoveredCell.y, "white");
      }
      setHoveredCell({ x, y });
      if (!isDrawing) {
        fillCell(x, y, "#ddd");
      }
    }
    if (isDrawing) {
      fillCell(x, y, "black");
    }
  };

  const handleMouseDown = () => {
    setIsDrawing(true);
    if (hoveredCell) {
      fillCell(hoveredCell.x, hoveredCell.y, "black");
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    if (hoveredCell && !isDrawing) {
      fillCell(hoveredCell.x, hoveredCell.y, "white");
      setHoveredCell(null);
    }
    setIsDrawing(false);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        style={{
          imageRendering: "pixelated",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        className="border-t border-l border-gray-100"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};

export default Editor;
