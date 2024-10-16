import { createStore } from "zustand";
import { Layer, LayerChangeType } from "../../types/layer";
import { Trait, NomTrait } from "../../types/trait";
import { Nom } from "../../types/nom";

// TODO:
// add "actions" that map to layer types
// - buy + equip trait
// - equip trait
// - unequip trait
// - "unbuy + unequip" trait
// or, for each trait layer type, have an "undo" action

export interface INomBuilderState {
  layers: Layer[];
  initialLayers: Layer[];
  ownedTraits: NomTrait[];
  pendingTraits: Trait[];
  selectedTraitId: string | null;
  showingSelectedTraitDetails: boolean;
  traitSearchQuery: string;
  typeQuery: string;
  nomId: string | null;
  setTypeQuery: (query: string) => void;
  setTraitSearchQuery: (query: string) => void;
  setShowingSelectedTraitDetails: (showing: boolean) => void;
  setSelectedTraitId: (id: string | null) => void;
  setNomId: (id: string | null) => void;
  addLayer: (layer: Layer) => void;
  removeLayer: (layer: Layer) => void;
  setEquippedTraitAsUnequipped: (trait: Trait) => void;
  setUnequippedTraitAsEquipped: (trait: Trait) => void;
  setOwnedTraitAsEquipped: (trait: Trait) => void;
  setLayers: (layers: Layer[]) => void;
  setOwnedTraits: (traits: NomTrait[]) => void;
  setPendingTraits: (traits: Trait[]) => void;
  addPendingTrait: (trait: Trait) => void;
  removePendingTrait: (trait: Trait) => void;
  addUnOwnedTrait: (trait: Trait) => void;
  removeUnOwnedTrait: (trait: Trait) => void;
  saveAndResetState: () => void;
}

export type NomBuilderStore = ReturnType<typeof createNomBuilderStore>;

// Todo:
// Idea of keeping track of all changes in a separate array so we can track
// the history of changes. It would also allow us to easily track the order
// changes, and can parse the total transaction diff by looking at all changes
export const createNomBuilderStore = (nom: Nom | null) => {
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

  return createStore<INomBuilderState>((set) => ({
    layers: initialLayers,
    initialLayers,
    ownedTraits,
    pendingTraits: [],
    selectedTraitId: null,
    showingSelectedTraitDetails: false,
    traitSearchQuery: "",
    typeQuery: "",
    nomId: nom?.tokenId || null,
    setNomId: (id: string | null) => set({ nomId: id }),
    setTraitSearchQuery: (query: string) => set({ traitSearchQuery: query }),
    setTypeQuery: (query: string) => set({ typeQuery: query }),
    setShowingSelectedTraitDetails: (showing: boolean) =>
      set({ showingSelectedTraitDetails: showing }),
    setSelectedTraitId: (id: string | null) => set({ selectedTraitId: id }),
    addLayer: (layer: Layer) =>
      set((state: any) => ({ layers: [...state.layers, layer] })),
    removeLayer: (layer: Layer) =>
      set((state: any) => ({
        layers: state.layers.filter((l: Layer) => l !== layer),
      })),
    // used for closet
    setEquippedTraitAsUnequipped: (trait: Trait) =>
      set((state: any) => ({
        layers: state.layers.map((l: Layer) =>
          l.trait.id === trait.id ? { ...l, type: LayerChangeType.UNEQUIP } : l
        ),
      })),
    // used for closet
    setUnequippedTraitAsEquipped: (trait: Trait) =>
      set((state: any) => ({
        layers: state.layers.map((l: Layer) =>
          l.trait.id === trait.id ? { ...l, type: LayerChangeType.FIXED } : l
        ),
      })),
    setOwnedTraitAsEquipped: (trait: Trait) =>
      set((state: any) => ({
        layers: [
          ...state.layers,
          {
            trait,
            owned: true,
            equipped: false,
            type: LayerChangeType.EQUIP,
          },
        ],
      })),
    // adds new trait to the layer stack and adds new "pending trait"
    addUnOwnedTrait: (trait: Trait) => {
      const newLayer = {
        trait,
        owned: false,
        equipped: true,
        type: LayerChangeType.BUY_AND_EQUIP,
      };
      set((state: any) => ({
        layers: [...state.layers, newLayer],
        pendingTraits: [...state.pendingTraits, trait],
      }));
    },
    removeUnOwnedTrait: (trait: Trait) => {
      set((state: any) => ({
        layers: state.layers.filter((l: Layer) => l.trait.id !== trait.id),
        pendingTraits: state.pendingTraits.filter((t: Trait) => t !== trait),
      }));
    },
    addOwnedTrait: (trait: NomTrait) => {
      set((state: any) => ({ ownedTraits: [...state.ownedTraits, trait] }));
    },
    setLayers: (layers: Layer[]) => set({ layers }),
    setOwnedTraits: (traits: NomTrait[]) => set({ ownedTraits: traits }),
    setPendingTraits: (traits: Trait[]) => set({ pendingTraits: traits }),
    addPendingTrait: (trait: Trait) =>
      set((state: any) => ({ pendingTraits: [...state.pendingTraits, trait] })),
    removePendingTrait: (trait: Trait) =>
      set((state: any) => ({
        pendingTraits: state.pendingTraits.filter((t: Trait) => t !== trait),
      })),
    saveAndResetState: () => {
      // save nom
      // mint traits
      // take layers, process each layer into appropriate initial state
      // ---------------------------------------------------------------
      // need to update:
      // ownedTraits
      // initialLayers => owned traits that are equipped
      // layers => initialLayers
      // pendingTraits => []
      set((state: INomBuilderState) => {
        const existingLayers = state.layers;
        const newlyOwnedTraitsAsNomTraits: NomTrait[] = existingLayers
          .filter((l: Layer) => l.type === LayerChangeType.BUY_AND_EQUIP)
          .map((l: Layer) => ({
            id: l.trait.id,
            trait: l.trait,
            equipped: true,
            owned: true,
            quantity: 1,
            nom: nom!,
          }));

        const updatedOwnedTraits: NomTrait[] = [
          ...state.ownedTraits,
          ...newlyOwnedTraitsAsNomTraits,
        ];

        const updatedInitialLayers = existingLayers
          .filter((l: Layer) => l.type !== LayerChangeType.UNEQUIP)
          .map((l: Layer) => ({
            trait: l.trait,
            equipped: true,
            owned: true,
            type: LayerChangeType.FIXED,
          }));

        return {
          ownedTraits: updatedOwnedTraits,
          initialLayers: updatedInitialLayers,
          layers: updatedInitialLayers,
          pendingTraits: [],
        };
      });
    },
  }));
};
