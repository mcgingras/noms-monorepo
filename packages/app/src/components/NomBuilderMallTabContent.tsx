"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getTraits } from "@/actions/getTraits";
import { useSearchParams } from "next/navigation";
import TraitCard from "@/components/TraitCard";
import TraitViewer from "@/components/TraitViewer";
import ShirtIcon from "@/components/icons/Shirt";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import { LayerChangeType } from "@/types/layer";
import { Trait } from "@/types/trait";

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

  return (
    <div
      className="bg-[#222] rounded-lg absolute bottom-2 left-2 flex items-center justify-center p-1 group-hover:opacity-100 opacity-0"
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

  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "all";

  const { data } = useSuspenseQuery({
    queryKey: ["traits-query", type, traitSearchQuery],
    queryFn: async () => {
      const traits = await getTraits(type, traitSearchQuery);
      return { traits };
    },
  });

  const { traits } = data;

  return (
    <>
      <div className="w-full bg-gray-900 p-2 rounded-lg my-2 flex-1 overflow-y-scroll">
        <div className="flex flex-row flex-wrap gap-4">
          {traits.map((trait: any) => (
            <TraitCard
              key={trait.id}
              trait={trait}
              isActive={selectedTraitId === trait.id}
              onClickTrait={() => setSelectedTraitId(trait.id)}
              actionComponent={<AddToCartAction trait={trait} />}
            />
          ))}
        </div>
      </div>
      {selectedTraitId && <TraitViewer traitId={selectedTraitId} />}
    </>
  );
};

export default NomBuilderMallTabContent;
