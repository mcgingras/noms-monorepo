"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

const TraitCard = ({
  trait,
  onMouseEnter,
  onClick,
}: {
  trait: any;
  onClick: (trait: any) => void;
  onMouseEnter?: (trait: any) => void;
}) => {
  const isActive = useSearchParams().get("trait") === trait.id;

  return (
    <div
      className={`bg-[#333] w-[100px] h-[100px] rounded-lg relative cursor-pointer ${isActive ? "ring-2 ring-[#FDCB3F] ring-offset-[#151515] ring-offset-2" : ""}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
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
