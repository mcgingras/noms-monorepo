"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/SelectInput";
import { Nom } from "@/types/nom";
import { useTraitEditorContext } from "@/stores/traitEditor/context";
import HeadlessLayerStack from "@/components/HeadlessLayerStack";
import CreateTraitModal from "@/app/traits/components/CreateTraitModal";

const NomAndLayerStack = ({ noms }: { noms: Nom[] }) => {
  const layers = useTraitEditorContext((state) => state.layers);
  const setLayers = useTraitEditorContext((state) => state.setLayers);
  const nomId = useTraitEditorContext((state) => state.nomId);
  const [isCreateTraitModalOpen, setIsCreateTraitModalOpen] = useState(false);
  return (
    <>
      <CreateTraitModal
        isOpen={isCreateTraitModalOpen}
        setIsOpen={setIsCreateTraitModalOpen}
      />
      <div className="w-[288px] h-full flex flex-col">
        <h3 className="text-white text-xl oziksoft mb-1">Select nom</h3>
        <Select defaultValue={nomId || ""}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Nom" />
          </SelectTrigger>
          <SelectContent>
            {noms?.length === 0 && <div className="p-2">No noms found</div>}
            {noms?.map((nom: Nom) => (
              <SelectItem key={nom.tokenId} value={nom.tokenId}>
                Nom #{nom.tokenId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <h3 className="text-white text-xl oziksoft mt-2 mb-1">Layers</h3>
        <div className="flex-1">
          <HeadlessLayerStack
            layers={layers}
            title="All layers"
            setLayers={setLayers}
          />
        </div>
        <button
          onClick={() => setIsCreateTraitModalOpen(true)}
          className="w-full bg-blue-500 text-center rounded-lg font-bold pangram-sans flex items-center justify-center gap-2 py-1.5 mb-1"
        >
          Configure trait
        </button>
      </div>
    </>
  );
};

export default NomAndLayerStack;
