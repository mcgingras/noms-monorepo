import { useReducer, useCallback } from "react";

export type Pixel = string;
export type PixelGrid = Pixel[][];
export type DrawMode = "brush" | "fill" | "circle";

export interface PixelGridState {
  currentGrid: PixelGrid;
  history: PixelGrid[];
  future: PixelGrid[];
  currentColor: string;
  brushSize: number;
  drawMode: DrawMode;
}

export type Action =
  | { type: "START_DRAW" }
  | { type: "DRAW"; payload: { x: number; y: number } }
  | { type: "END_DRAW" }
  | { type: "SET_COLOR"; payload: string }
  | { type: "SET_BRUSH_SIZE"; payload: number }
  | { type: "SET_DRAW_MODE"; payload: DrawMode }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "CLEAR" };

const createEmptyGrid = (width: number, height: number): PixelGrid =>
  Array(height)
    .fill(null)
    .map(() => Array(width).fill("#FFF"));

const gridReducer = (state: PixelGridState, action: Action): PixelGridState => {
  switch (action.type) {
    case "START_DRAW":
      return {
        ...state,
        history: [state.currentGrid, ...state.history],
        future: [],
      };
    case "DRAW": {
      const newGrid = state.currentGrid.map((row) => [...row]);
      const { x, y } = action.payload;

      if (state.drawMode === "brush") {
        for (let i = -state.brushSize + 1; i < state.brushSize; i++) {
          for (let j = -state.brushSize + 1; j < state.brushSize; j++) {
            if (
              x + i >= 0 &&
              x + i < newGrid[0].length &&
              y + j >= 0 &&
              y + j < newGrid.length
            ) {
              newGrid[y + j][x + i] = state.currentColor;
            }
          }
        }
      } else if (state.drawMode === "fill") {
        const targetColor = state.currentGrid[y][x];
        const fill = (x: number, y: number) => {
          if (
            x < 0 ||
            x >= newGrid[0].length ||
            y < 0 ||
            y >= newGrid.length ||
            newGrid[y][x] !== targetColor
          ) {
            return;
          }
          newGrid[y][x] = state.currentColor;
          fill(x + 1, y);
          fill(x - 1, y);
          fill(x, y + 1);
          fill(x, y - 1);
        };
        fill(x, y);
      } else if (state.drawMode === "circle") {
        const radius = state.brushSize - 1;
        for (let i = -radius; i <= radius; i++) {
          for (let j = -radius; j <= radius; j++) {
            if (i * i + j * j <= radius * radius) {
              const newX = x + i;
              const newY = y + j;
              if (
                newX >= 0 &&
                newX < newGrid[0].length &&
                newY >= 0 &&
                newY < newGrid.length
              ) {
                newGrid[newY][newX] = state.currentColor;
              }
            }
          }
        }
      }

      return {
        ...state,
        currentGrid: newGrid,
      };
    }
    case "END_DRAW":
      if (
        JSON.stringify(state.currentGrid) === JSON.stringify(state.history[0])
      ) {
        return state;
      }
      return state;
    case "SET_COLOR":
      return { ...state, currentColor: action.payload };
    case "SET_BRUSH_SIZE":
      return { ...state, brushSize: action.payload };
    case "SET_DRAW_MODE":
      return { ...state, drawMode: action.payload };
    case "UNDO": {
      if (state.history.length === 0) return state;
      const [previousGrid, ...newHistory] = state.history;
      return {
        ...state,
        currentGrid: previousGrid,
        history: newHistory,
        future: [state.currentGrid, ...state.future],
      };
    }
    case "REDO": {
      if (state.future.length === 0) return state;
      const [nextGrid, ...newFuture] = state.future;
      return {
        ...state,
        currentGrid: nextGrid,
        history: [state.currentGrid, ...state.history],
        future: newFuture,
      };
    }
    case "CLEAR":
      return {
        ...state,
        currentGrid: createEmptyGrid(
          state.currentGrid[0].length,
          state.currentGrid.length
        ),
        history: [state.currentGrid, ...state.history],
        future: [],
      };
    default:
      return state;
  }
};

export const usePixelGrid = (initialWidth: number, initialHeight: number) => {
  const [state, dispatch] = useReducer(gridReducer, {
    currentGrid: createEmptyGrid(initialWidth, initialHeight),
    history: [],
    future: [],
    currentColor: "#000",
    brushSize: 1,
    drawMode: "brush" as DrawMode,
  });

  const startDraw = useCallback(() => {
    dispatch({ type: "START_DRAW" });
  }, []);

  const draw = useCallback((x: number, y: number) => {
    dispatch({ type: "DRAW", payload: { x, y } });
  }, []);

  const endDraw = useCallback(() => {
    dispatch({ type: "END_DRAW" });
  }, []);

  const setColor = useCallback((color: string) => {
    dispatch({ type: "SET_COLOR", payload: color });
  }, []);

  const setBrushSize = useCallback((size: number) => {
    dispatch({ type: "SET_BRUSH_SIZE", payload: size });
  }, []);

  const setDrawMode = useCallback((mode: DrawMode) => {
    dispatch({ type: "SET_DRAW_MODE", payload: mode });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  return {
    grid: state.currentGrid,
    startDraw,
    draw,
    endDraw,
    setColor,
    setBrushSize,
    setDrawMode,
    undo,
    redo,
    clear,
    currentColor: state.currentColor,
    brushSize: state.brushSize,
    drawMode: state.drawMode,
  };
};
