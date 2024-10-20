import { createStore } from "zustand";
import { Layer, LayerChangeType } from "../../types/layer";
import { NomTrait, Trait } from "../../types/trait";
import { Nom } from "../../types/nom";
import { getRLE } from "@/lib/rle";

export interface ITraitEditorState {
  layers: Layer[];
  editorLayers: Layer[];
  ownedTraits: NomTrait[];
  nom: Nom | null;
  nomId: string | null;
  updateCustomLayerWithGridDetails: (grid: string[][]) => void;
  setNomId: (id: string | null) => void;
  setEditorLayers: (layers: Layer[]) => void;
  addLayer: (layer: Layer) => void;
  removeLayer: (layer: Layer) => void;
  setLayers: (layers: Layer[]) => void;
  hideTraitInEditorLayers: (trait: Trait) => void;
  showTraitInEditorLayers: (trait: Trait) => void;
}

export type TraitEditorStore = ReturnType<typeof createTraitEditorStore>;

export const createTraitEditorStore = (nom: Nom | null) => {
  const ownedTraits = nom?.traits || [];
  const initialLayers =
    ownedTraits
      ?.filter((nomTrait) => nomTrait.equipped)
      .map((nomTrait) => {
        return {
          trait: nomTrait.trait,
          equipped: true,
          owned: true,
          type: LayerChangeType.FIXED,
        };
      }) || [];

  const customLayer = {
    trait: {
      id: "custom",
      name: "New trait",
      type: "custom",
      svg: "",
      rleBytes: "",
      description: "",
      creator: "",
      mintModuleAddress: "",
    },
    equipped: false,
    owned: false,
    type: LayerChangeType.FIXED,
  };

  return createStore<ITraitEditorState>((set) => ({
    layers: [customLayer, ...initialLayers],
    editorLayers: [customLayer, ...initialLayers],
    ownedTraits,
    nom: nom || null,
    nomId: nom?.tokenId || null,
    setNomId: (id: string | null) => set({ nomId: id }),
    updateCustomLayerWithGridDetails: (grid: string[][]) =>
      set((state: any) => {
        const rle = getRLE(grid);
        const updatedCustomTrait = {
          id: "custom",
          name: "New trait",
          type: "custom",
          svg: "",
          rleBytes: rle,
        };
        return {
          layers: state.layers.map((layer: Layer) => {
            if (layer.trait.id === "custom") {
              return {
                ...layer,
                trait: updatedCustomTrait,
              };
            }
            return layer;
          }),
          editorLayers: state.editorLayers.map((layer: Layer) => {
            if (layer.trait.id === "custom") {
              return {
                ...layer,
                trait: updatedCustomTrait,
              };
            }
            return layer;
          }),
        };
      }),
    addLayer: (layer: Layer) =>
      set((state: any) => ({ layers: [...state.layers, layer] })),
    removeLayer: (layer: Layer) =>
      set((state: any) => ({
        layers: state.layers.filter((l: Layer) => l !== layer),
      })),
    setLayers: (layers: Layer[]) => set({ layers }),
    setEditorLayers: (layers: Layer[]) => set({ editorLayers: layers }),
    hideTraitInEditorLayers: (trait: Trait) =>
      set((state: any) => ({
        editorLayers: state.editorLayers.map((l: Layer) =>
          l.trait.id === trait.id ? { ...l, type: LayerChangeType.UNEQUIP } : l
        ),
      })),
    showTraitInEditorLayers: (trait: Trait) =>
      set((state: any) => ({
        editorLayers: state.editorLayers.map((l: Layer) =>
          l.trait.id === trait.id ? { ...l, type: LayerChangeType.FIXED } : l
        ),
      })),
  }));
};
