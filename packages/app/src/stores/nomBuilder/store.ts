import { createStore } from "zustand";
import { Layer, LayerChangeType } from "../../types/layer";
import { Trait, NomTrait } from "../../types/trait";
import { Nom } from "../../types/nom";

export interface INomBuilderState {
  layers: Layer[];
  ownedTraits: NomTrait[];
  pendingTraits: Trait[];
  selectedTraitId: string | null;
  showingSelectedTraitDetails: boolean;
  traitSearchQuery: string;
  setTraitSearchQuery: (query: string) => void;
  setShowingSelectedTraitDetails: (showing: boolean) => void;
  setSelectedTraitId: (id: string) => void;
  addLayer: (layer: Layer) => void;
  removeLayer: (layer: Layer) => void;
  setLayers: (layers: Layer[]) => void;
  setOwnedTraits: (traits: NomTrait[]) => void;
  setPendingTraits: (traits: Trait[]) => void;
  addPendingTrait: (trait: Trait) => void;
  removePendingTrait: (trait: Trait) => void;
}

export type NomBuilderStore = ReturnType<typeof createNomBuilderStore>;

// Todo:
// Idea of keeping track of all changes in a separate array so we can track
// the history of changes. It would also allow us to easily track the order
// changes, and can parse the total transaction diff by looking at all changes
export const createNomBuilderStore = (nom: Nom) => {
  const ownedTraits = nom.traits || [];
  const initialLayers =
    ownedTraits
      ?.filter((nomTrait) => nomTrait.equipped)
      .map((nomTrait) => {
        return {
          trait: nomTrait.trait,
          equipped: nomTrait.equipped,
          owned: true,
          type: LayerChangeType.FIXED,
        };
      }) || [];

  return createStore<INomBuilderState>((set) => ({
    layers: initialLayers,
    ownedTraits,
    pendingTraits: [],
    selectedTraitId: null,
    showingSelectedTraitDetails: false,
    traitSearchQuery: "",
    setTraitSearchQuery: (query: string) => set({ traitSearchQuery: query }),
    setShowingSelectedTraitDetails: (showing: boolean) =>
      set({ showingSelectedTraitDetails: showing }),
    setSelectedTraitId: (id: string) => set({ selectedTraitId: id }),
    addLayer: (layer: Layer) =>
      set((state: any) => ({ layers: [...state.layers, layer] })),
    removeLayer: (layer: Layer) =>
      set((state: any) => ({
        layers: state.layers.filter((l: Layer) => l !== layer),
      })),
    setLayers: (layers: Layer[]) => set({ layers }),
    setOwnedTraits: (traits: NomTrait[]) => set({ ownedTraits: traits }),
    setPendingTraits: (traits: Trait[]) => set({ pendingTraits: traits }),
    addPendingTrait: (trait: Trait) =>
      set((state: any) => ({ pendingTraits: [...state.pendingTraits, trait] })),
    removePendingTrait: (trait: Trait) =>
      set((state: any) => ({
        pendingTraits: state.pendingTraits.filter((t: Trait) => t !== trait),
      })),
  }));
};
