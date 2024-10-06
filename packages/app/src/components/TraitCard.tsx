"use client";

import Image from "next/image";
import { Trait } from "@/types/trait";
import { cn } from "@/lib/utils";

const TraitCard = ({
  trait,
  isActive,
  onClickTrait,
  actionComponent,
}: {
  trait: Trait;
  isActive: boolean;
  onClickTrait: (trait: any) => void;
  actionComponent?: React.ReactNode;
}) => {
  //   const isInStack = isTraitInStack(trait);
  const isInStack = false;

  return (
    <div
      className={cn(
        "group bg-[#2d2d2d] w-[100px] h-[100px] rounded-lg relative cursor-pointer ring-0 hover:ring-[3px] ring-transparent ring-offset-gray-900 ring-offset-4 hover:ring-[#FDCB3F] transition-all",
        isActive ? "ring-[3px] ring-[#FDCB3F]" : "ring-transparent"
      )}
      onClick={onClickTrait}
    >
      <Image
        src={`data:image/svg+xml;base64,${trait.svg}`}
        alt="Trait"
        fill
        className="absolute"
      />
      {actionComponent}
      {isInStack && (
        <div className="absolute top-0 right-0 bg-red-500 w-4 h-4 rounded-full"></div>
      )}
    </div>
  );
};

export default TraitCard;
