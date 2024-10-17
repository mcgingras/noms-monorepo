"use client";

import { Trait } from "@/types/trait";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAddSearchParam } from "@/hooks/useAddSearchParam";

const TraitGridUI = ({
  traits,
  selectedTraitId,
  isLoading,
}: {
  traits: Trait[];
  selectedTraitId: string;
  isLoading: boolean;
}) => {
  const addSearchParam = useAddSearchParam();

  const empties = Array.from({ length: 60 }, (_, index) => index);

  if (isLoading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 content-start p-2">
        {empties.map((_, index) => {
          return (
            <div
              className="aspect-square flex-shrink-0 group bg-[#2d2d2d] rounded-lg relative cursor-pointer ring-0 hover:ring-[3px] ring-transparent ring-offset-4 hover:ring-[#FDCB3F] transition-all ring-offset-gray-900"
              key={index}
            ></div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 content-start p-2">
      {traits.map((trait) => (
        <div
          className={cn(
            "aspect-square flex-shrink-0 group bg-[#2d2d2d] rounded-lg relative cursor-pointer ring-0 hover:ring-[3px] ring-transparent ring-offset-4 hover:ring-[#FDCB3F] transition-all ring-offset-gray-900",
            selectedTraitId === trait.id.toString()
              ? "ring-[3px] ring-[#FDCB3F]"
              : "ring-transparent"
          )}
          onClick={() => {
            addSearchParam("traitId", trait.id.toString());
          }}
        >
          <Image
            src={`data:image/svg+xml;base64,${trait.svg}`}
            alt="Trait"
            fill
            className="absolute"
          />
        </div>
      ))}
    </div>
  );
};

export default TraitGridUI;
