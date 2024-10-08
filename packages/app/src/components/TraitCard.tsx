"use client";

import Image from "next/image";
import { Trait } from "@/types/trait";
import { cn } from "@/lib/utils";

const TraitCard = ({
  trait,
  isSelected,
  isSecondarySelected,
  onClickTrait,
  actionComponent,
  metadataComponent,
}: {
  trait: Trait;
  isSelected: boolean;
  isSecondarySelected: boolean;
  onClickTrait: (trait: any) => void;
  actionComponent?: React.ReactNode;
  metadataComponent?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group bg-[#2d2d2d] w-[100px] h-[100px] rounded-lg relative cursor-pointer ring-0 hover:ring-[3px] ring-transparent ring-offset-4 hover:ring-[#FDCB3F] transition-all",
        isSelected ? "ring-[3px] ring-[#FDCB3F]" : "ring-transparent",
        isSecondarySelected ? "ring-offset-[#5648ED]" : "ring-offset-gray-900"
      )}
      onClick={onClickTrait}
    >
      <Image
        src={`data:image/svg+xml;base64,${trait.svg}`}
        alt="Trait"
        fill
        className="absolute"
      />
      {metadataComponent}
      {actionComponent}
    </div>
  );
};

export default TraitCard;
