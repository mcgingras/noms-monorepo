import { create } from "zustand";
import { Layer } from "../types/layer";

const useNomEditorStore = create((set) => ({
  layers: [],
  addLayer: (layer: Layer) =>
    set((state: any) => ({ layers: [...state.layers, layer] })),
  removeLayer: (layer: Layer) =>
    set((state: any) => ({
      layers: state.layers.filter((l: Layer) => l !== layer),
    })),
}));

export default useNomEditorStore;
