"use client";

import Image from "next/image";
import { Trait } from "@/types/trait";
import { cn } from "@/lib/utils";

const TraitCard = ({
  trait,
  onClickTrait,
  actionComponent,
  metadataComponent,
  isEquipped,
  isStaged,
  isActive,
}: {
  trait: Trait;
  onClickTrait: (trait: any) => void;
  actionComponent?: React.ReactNode;
  metadataComponent?: React.ReactNode;
  isEquipped?: boolean;
  isStaged?: boolean;
  isActive?: boolean;
}) => {
  return (
    <div
      className={cn(
        "group bg-[#2d2d2d] w-[100px] h-[100px] rounded-lg relative cursor-pointer ring-0 hover:ring-[3px] ring-transparent ring-offset-4 hover:ring-[#FDCB3F] transition-all",
        isActive ? "ring-[3px] ring-[#FDCB3F]" : "ring-transparent",
        isStaged
          ? "ring-offset-[#257CED]"
          : isEquipped
            ? "ring-offset-[#5648ED]"
            : "ring-offset-gray-900"
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
