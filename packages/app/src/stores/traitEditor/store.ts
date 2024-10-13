import { createStore } from "zustand";
import { Layer, LayerChangeType } from "../../types/layer";
import { NomTrait } from "../../types/trait";
import { Nom } from "../../types/nom";
import { getRLE } from "@/lib/rle";

export interface ITraitEditorState {
  layers: Layer[];
  ownedTraits: NomTrait[];
  nomId: string | null;
  updateCustomLayerWithGridDetails: (grid: string[][]) => void;
  setNomId: (id: string | null) => void;
  addLayer: (layer: Layer) => void;
  removeLayer: (layer: Layer) => void;
  setLayers: (layers: Layer[]) => void;
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
      rleBytes:
        "0x00091c1d0505000423010004230900030002231200020001231400020001231400010001231500010001231500010001230c00062303000123130001230200012314000123010001230a0002230900012301230a00022309000123010001230a00012309000123010001230a00012309000123010001230b000323060001230200022311000123010003000123110001230100040001230f0002230100050001230e0001230200060002230b0001230300080002230800012304000a0008230500",
    },
    equipped: false,
    owned: false,
    type: LayerChangeType.FIXED,
  };

  return createStore<ITraitEditorState>((set) => ({
    layers: [customLayer, ...initialLayers],
    ownedTraits,
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
        };
      }),
    addLayer: (layer: Layer) =>
      set((state: any) => ({ layers: [...state.layers, layer] })),
    removeLayer: (layer: Layer) =>
      set((state: any) => ({
        layers: state.layers.filter((l: Layer) => l !== layer),
      })),
    setLayers: (layers: Layer[]) => set({ layers }),
  }));
};
