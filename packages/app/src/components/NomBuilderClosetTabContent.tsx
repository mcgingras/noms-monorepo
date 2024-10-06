"use client";

import ClosetList from "@/components/ClosetList";
import TraitViewer from "@/components/TraitViewer";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import TraitCard from "@/components/TraitCard";
import { Trait } from "@/types/trait";

const NomBuilderClosetTabContent = () => {
  const typeQuery = useNomBuilderContext((state) => state.typeQuery);
  const searchQuery = useNomBuilderContext((state) => state.traitSearchQuery);

  const setSelectedTraitId = useNomBuilderContext(
    (state) => state.setSelectedTraitId
  );
  const selectedTraitId = useNomBuilderContext(
    (state) => state.selectedTraitId
  );

  const pendingTraits = useNomBuilderContext((state) => state.pendingTraits);
  const filteredTraits = pendingTraits
    .filter((trait) => {
      if (typeQuery === "all") return true;
      return trait.type === typeQuery;
    })
    .filter((trait) => {
      if (searchQuery === "") return true;
      return trait.name
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
    });

  return (
    <>
      {filteredTraits.length > 0 && (
        <div className="w-full bg-gray-900 p-2 rounded-lg mt-2">
          <h3 className="pangram-sans-compact font-bold">Changing room</h3>
          <div className="mt-2 flex flex-row flex-wrap gap-4">
            {filteredTraits.map((trait) => (
              <TraitCard
                key={trait.id}
                trait={trait}
                isActive={false}
                onClickTrait={() => {
                  setSelectedTraitId(trait.id.toString());
                }}
              />
            ))}
          </div>
        </div>
      )}
      <hr className="mt-2 border-gray-900" />
      <div className="pt-2 flex-1">
        <h3 className="pangram-sans-compact font-bold">Closet</h3>
        <ClosetList
          onClickTrait={(trait: Trait) => {
            setSelectedTraitId(trait.id.toString());
          }}
        />
      </div>
      {selectedTraitId && <TraitViewer traitId={selectedTraitId} />}
    </>
  );
};

export default NomBuilderClosetTabContent;
