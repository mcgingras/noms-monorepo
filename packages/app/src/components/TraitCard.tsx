"use client";

import Image from "next/image";
import ShirtIcon from "@/components/icons/Shirt";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import { LayerChangeType } from "@/types/layer";
import { Trait } from "@/types/trait";

const TraitCard = ({
  trait,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onClickTrait,
}: {
  trait: Trait;
  isActive: boolean;
  onClickTrait: (trait: any) => void;
  onMouseEnter?: (trait: any) => void;
  onMouseLeave?: (trait: any) => void;
}) => {
  const addLayer = useNomBuilderContext((state) => state.addLayer);
  const addPendingTrait = useNomBuilderContext(
    (state) => state.addPendingTrait
  );
  //   const isInStack = isTraitInStack(trait);
  const isInStack = false;

  const addTraitToLayersFromShop = (trait: Trait) => {
    const newLayer = {
      trait,
      owned: false,
      equipped: true,
      type: LayerChangeType.BUY_AND_EQUIP,
    };
    addLayer(newLayer);
  };

  return (
    <div
      className={`group bg-[#2d2d2d] w-[100px] h-[100px] rounded-lg relative cursor-pointer ring-offset-gray-900 ring-[3px] ring-offset-4 hover:ring-[#FDCB3F] ${
        isActive ? "ring-[#FDCB3F]" : "ring-transparent"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClickTrait}
    >
      <Image
        src={`data:image/svg+xml;base64,${trait.svg}`}
        alt="Trait"
        fill
        className="absolute"
      />
      <div
        className="bg-[#222] rounded-lg absolute bottom-2 left-2 flex items-center justify-center p-1 group-hover:opacity-100 opacity-0"
        onClick={() => {
          if (!isInStack) {
            addTraitToLayersFromShop(trait);
            addPendingTrait(trait);
          }
        }}
      >
        <ShirtIcon className="" />
      </div>
      {isInStack && (
        <div className="absolute top-0 right-0 bg-red-500 w-4 h-4 rounded-full"></div>
      )}
    </div>
  );
};

export default TraitCard;
