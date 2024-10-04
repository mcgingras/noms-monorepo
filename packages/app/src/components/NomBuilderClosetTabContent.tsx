"use client";

import { useState } from "react";
import Image from "next/image";
import ClosetList from "@/components/ClosetList";
import TraitViewer from "@/components/TraitViewer";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";

const NomBuilderClosetTabContent = () => {
  const [selectedTraitId, setSelectedTraitId] = useState<number | null>(null);
  const pendingTraits = useNomBuilderContext((state) => state.pendingTraits);
  return (
    <>
      {pendingTraits.length > 0 && (
        <div className="w-full bg-gray-900 p-2 rounded-lg mt-2">
          <h3 className="pangram-sans-compact font-bold">Changing room</h3>
          <div className="mt-2 flex flex-row flex-wrap gap-2">
            {pendingTraits.map((trait) => (
              <div
                key={trait.id}
                className="min-w-[85px] aspect-square rounded-lg bg-gray-800 relative"
                onClick={() => setSelectedTraitId(trait.id)}
              >
                <Image
                  src={`data:image/svg+xml;base64,${trait.svg}`}
                  alt="Trait"
                  fill
                  className="absolute"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <hr className="mt-2 border-gray-900" />
      <div className="pt-2 flex-1">
        <h3 className="pangram-sans-compact font-bold">Closet</h3>
        <ClosetList />
      </div>
      {selectedTraitId && <TraitViewer traitId={selectedTraitId} />}
    </>
  );
};

export default NomBuilderClosetTabContent;
