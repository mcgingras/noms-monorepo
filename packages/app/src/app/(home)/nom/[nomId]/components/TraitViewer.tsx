"use client";

import CloseIcon from "@/components/icons/CloseIcon";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";

const TraitViewer = ({ trait }: { trait: any }) => {
  const setShowingSelectedTraitDetails = useNomBuilderContext(
    (state) => state.setShowingSelectedTraitDetails
  );

  return (
    <div className="p-2 bg-[#333] rounded absolute bottom-2 w-[calc(100%-16px)]">
      <div className="flex flex-row justify-between">
        <h5 className="pangram-sans font-bold">{trait.name}</h5>

        <div
          className="flex flex-row items-center gap-1.5 bg-[#E3EDE3] text-[#222] rounded-full px-2 py-1 cursor-pointer"
          onClick={() => setShowingSelectedTraitDetails(false)}
        >
          <span className="bg-[#222] p-1 rounded-full">
            <CloseIcon className="w-4 h-4 text-white" />
          </span>
          <button className="text-sm pangram-sans font-bold">Close</button>
        </div>
      </div>
      <div className="flex flex-row space-x-2 mt-4">
        <div className="w-1/2 flex flex-col">
          <h3>Creator</h3>
          <div className="w-full flex flex-row space-x-2 items-center mt-1">
            <span className="h-5 w-5 rounded-full bg-[#999] block"></span>
            <h3>{trait.name}</h3>
          </div>
        </div>
        <div className="w-1/2 flex flex-col">
          <h3>Collection</h3>
          <div className="w-full flex flex-row space-x-2 items-center mt-1">
            <span className="h-5 w-5 rounded-full bg-[#999] block"></span>
            <h3>{trait.name}</h3>
          </div>
        </div>
      </div>
      <div className="flex flex-row space-x-2 mt-4 justify-between">
        <p>Here is where the trait description would go.</p>
        <div className="text-black text-xs bg-white rounded-full px-2 py-1">
          More info
        </div>
      </div>
    </div>
  );
};

export default TraitViewer;
