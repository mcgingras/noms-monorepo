"use client";

import Image from "next/image";
import { useAddSearchParam } from "@/hooks/useAddSearchParam";
import { useSearchParams } from "next/navigation";
import { Trait } from "@/types/trait";
import { cn } from "@/lib/utils";
const TraitCard = ({
  trait,
  equipped,
}: {
  trait: Trait;
  equipped: boolean;
}) => {
  const addSearchParam = useAddSearchParam();
  const isActive = useSearchParams().get("trait") === trait.id.toString();

  return (
    <div
      className={cn(
        "bg-[#333] w-[100px] h-[100px] rounded-lg relative cursor-pointer",
        equipped && "ring-4 ring-[#FDCB3F]",
        isActive && "ring-4 ring-blue-500",
        equipped &&
          isActive &&
          "ring-[3px] ring-blue-500 ring-offset-4 ring-offset-[#FDCB3F]"
      )}
      onClick={() => {
        addSearchParam("trait", trait.id.toString());
      }}
    >
      <Image
        src={`data:image/svg+xml;base64,${trait.svg}`}
        alt="Trait"
        fill
        className="absolute"
      />
    </div>
  );
};

export default TraitCard;
