"use client";

import ClosetList from "@/components/ClosetList";
import TraitViewer from "@/components/TraitViewer";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import ChangingRoomList from "@/components/ChangingRoomList";
import { Trait } from "@/types/trait";

const NomBuilderClosetTabContent = () => {
  const selectedTraitId = useNomBuilderContext(
    (state) => state.selectedTraitId
  );
  const setSelectedTraitId = useNomBuilderContext(
    (state) => state.setSelectedTraitId
  );

  return (
    <>
      <ChangingRoomList />
      <hr className="mt-2 border-gray-900" />
      <div className="pt-2 pb-4 flex-1 overflow-y-scroll">
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
