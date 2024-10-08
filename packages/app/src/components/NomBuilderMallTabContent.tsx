"use client";

import TraitCard from "@/components/TraitCard";
import TraitViewer from "@/components/TraitViewer";
import ShirtIcon from "@/components/icons/Shirt";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import { LayerChangeType } from "@/types/layer";
import { Trait } from "@/types/trait";
import { useTraits } from "@/actions/useTraits";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const AddToCartAction = ({ trait }: { trait: Trait }) => {
  const addLayer = useNomBuilderContext((state) => state.addLayer);
  const addPendingTrait = useNomBuilderContext(
    (state) => state.addPendingTrait
  );
  const addTraitToLayersFromShop = (trait: Trait) => {
    const newLayer = {
      trait,
      owned: false,
      equipped: true,
      type: LayerChangeType.BUY_AND_EQUIP,
    };
    addLayer(newLayer);
  };

  const isInStack = false;
  const isEquipped = false;

  if (isEquipped) {
    return (
      <div className="h-[23px] w-[23px] bg-[#222] rounded-[6px] absolute bottom-1 left-1 flex items-center justify-center p-1">
        <ShirtIcon className="text-white" filled={true} />
      </div>
    );
  }

  return (
    <div
      className="h-[23px] w-[23px] bg-[#222] rounded-[6px] absolute bottom-1 left-1 flex items-center justify-center p-1 group-hover:opacity-100 opacity-0"
      onClick={(e) => {
        e.stopPropagation();

        if (!isInStack) {
          addTraitToLayersFromShop(trait);
          addPendingTrait(trait);
        }
      }}
    >
      <ShirtIcon className="" />
    </div>
  );
};

const NomBuilderMallTabContent = () => {
  const selectedTraitId = useNomBuilderContext(
    (state) => state.selectedTraitId
  );
  const setSelectedTraitId = useNomBuilderContext(
    (state) => state.setSelectedTraitId
  );

  const traitSearchQuery = useNomBuilderContext(
    (state) => state.traitSearchQuery
  );

  const typeQuery = useNomBuilderContext((state) => state.typeQuery);
  const {
    data: traits,
    error,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    status,
  } = useTraits({
    typeFilter: typeQuery,
    searchQuery: traitSearchQuery,
  });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  return (
    <>
      <div className="w-full bg-gray-900 p-2 rounded-lg my-2 flex-1 overflow-y-scroll">
        {traits.length === 0 && (
          <div className="flex flex-row justify-center items-center h-full">
            <p className="pangram-sans text-gray-400">No traits found</p>
          </div>
        )}
        <div className="flex flex-row flex-wrap gap-4">
          {traits.map((trait: Trait) => (
            <TraitCard
              key={trait.id}
              trait={trait}
              isActive={selectedTraitId === trait.id}
              onClickTrait={() => setSelectedTraitId(trait.id)}
              actionComponent={<AddToCartAction trait={trait} />}
            />
          ))}
        </div>
        {hasNextPage && (
          <div ref={ref} className="w-full py-4 flex justify-center">
            {isFetching ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
            ) : (
              <button
                onClick={() => fetchNextPage()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
      {selectedTraitId && <TraitViewer traitId={selectedTraitId} />}
    </>
  );
};

export default NomBuilderMallTabContent;
