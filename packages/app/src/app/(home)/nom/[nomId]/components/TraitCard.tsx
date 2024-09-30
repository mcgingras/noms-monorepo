"use client";

import Image from "next/image";
import { useAddSearchParam } from "@/hooks/useAddSearchParam";
import { useSearchParams } from "next/navigation";

const TraitCard = ({ trait }: { trait: any }) => {
  const addSearchParam = useAddSearchParam();
  const isActive = useSearchParams().get("trait") === trait.id;

  return (
    <div
      className={`bg-[#333] w-[100px] h-[100px] rounded-lg relative cursor-pointer ${isActive ? "ring-2 ring-[#FDCB3F] ring-offset-[#151515] ring-offset-2" : ""}`}
      onClick={() => {
        addSearchParam("trait", trait.id);
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
