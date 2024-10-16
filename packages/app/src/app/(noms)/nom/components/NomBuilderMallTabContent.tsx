"use client";

import TraitCard from "@/components/TraitCard";
import TraitViewer from "@/components/TraitViewer";
import ShirtIcon from "@/components/icons/Shirt";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import { Trait } from "@/types/trait";
import { useTraits } from "@/actions/useTraits";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { hooklessIsTraitStaged, hooklessIsTraitEquipped } from "@/lib/utils";
import ClockIcon from "@/components/icons/Clock";
import RareIcon from "@/components/icons/Rare";
import OwnedIcon from "@/components/icons/Owned";
import EthereumIcon from "../../../../components/icons/Ethereum";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/Tooltip";

const AddToCartAction = ({ trait }: { trait: Trait }) => {
  const addUnOwnedTrait = useNomBuilderContext(
    (state) => state.addUnOwnedTrait
  );

  const isInStack = false;
  const isEquipped = false;

  if (isEquipped) {
    return (
      <div className="h-[23px] w-[23px] bg-[#222] rounded-[6px] absolute bottom-1 left-1 flex items-center justify-center p-1">
        <ShirtIcon className="text-white" filled={false} />
      </div>
    );
  }

  return (
    <div
      className="h-[23px] w-[23px] bg-[#222] rounded-[6px] absolute bottom-1 left-1 flex items-center justify-center p-1 group-hover:opacity-100 opacity-0 transition-all"
      onClick={(e) => {
        e.stopPropagation();

        if (!isInStack) {
          addUnOwnedTrait(trait);
        }
      }}
    >
      <ShirtIcon className="text-white" filled={true} />
    </div>
  );
};

const MallTabTraitDetails = ({ trait }: { trait: Trait }) => {
  const nomId = useNomBuilderContext((state) => state.nomId);

  return (
    <div className="group-hover:opacity-100 opacity-0 transition-all absolute top-0 left-0 w-full h-full bg-black bg-opacity-10">
      {/* mint type icon */}
      <div className="h-[23px] bg-[#222] rounded-[6px] absolute top-1 left-1 flex items-center justify-center px-2">
        <span className="flex items-center gap-x-1.5 justify-center">
          <ClockIcon className="w-3 h-3" />
          {/* <span className="pangram-sans text-xs leading-[12px] font-bold mt-[1px]">
        6d
      </span> */}
        </span>
      </div>
      {/* owned + rare */}
      <div className="h-[23px] bg-[#222] rounded-[6px] absolute top-1 right-1 flex items-center gap-x-2 justify-center px-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <OwnedIcon className="w-3 h-3" />
            </TooltipTrigger>
            <TooltipContent>
              <span>{`Nom #${nomId} owns this trait.`}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <RareIcon className="w-3 h-3" />
            </TooltipTrigger>
            <TooltipContent>
              <span>{`This trait is rare.`}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {/* price */}

      <div className="h-[23px] bg-[#222] rounded-[6px] absolute bottom-1 right-1 flex items-center gap-x-1.5 justify-center px-2">
        <EthereumIcon className="w-3 h-3" />
        <span className="pangram-sans text-xs leading-[12px] font-bold mt-[1px]">
          0.01
        </span>
      </div>
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
  const layers = useNomBuilderContext((state) => state.layers);
  const typeQuery = useNomBuilderContext((state) => state.typeQuery);
  const {
    data,
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

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  return (
    <>
      <div className="w-full bg-gray-900 p-2 rounded-lg my-2 flex-1 overflow-y-scroll">
        {data.traits.length === 0 && (
          <div className="flex flex-row justify-center items-center h-full">
            <p className="pangram-sans text-gray-400">No traits found</p>
          </div>
        )}
        <div className="flex flex-row flex-wrap gap-4">
          {data.traits.map((trait: Trait) => {
            const isStaged = hooklessIsTraitStaged(layers, trait);
            const isEquipped = hooklessIsTraitEquipped(layers, trait);
            return (
              <TraitCard
                key={trait.id}
                trait={trait}
                isActive={selectedTraitId === trait.id}
                isStaged={isStaged}
                isEquipped={isEquipped}
                onClickTrait={() => setSelectedTraitId(trait.id)}
                actionComponent={<AddToCartAction trait={trait} />}
                metadataComponent={<MallTabTraitDetails trait={trait} />}
              />
            );
          })}
        </div>
        {hasNextPage && (
          <div ref={ref} className="w-full py-4 flex justify-center">
            {isFetching && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
            )}
          </div>
        )}
      </div>
      {selectedTraitId && <TraitViewer traitId={selectedTraitId} />}
    </>
  );
};

export default NomBuilderMallTabContent;
