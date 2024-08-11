"use client";

import { useSearchParams } from "next/navigation";
import { useAddSearchParam } from "@/hooks/useAddSearchParam";

type Trait = {
  id: bigint;
  rleBytes: `0x${string}`;
  name: string;
  type: "body" | "glasses" | "accessory" | "head" | "bg";
  svg: string;
};

const TraitGridUI = ({ traits }: { traits: Trait[] }) => {
  const searchParams = useSearchParams();
  const addSearchParam = useAddSearchParam();

  const traitId = searchParams.get("trait");

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {traits.map((trait) => (
        <div
          key={trait.id}
          className={`w-[100px] h-[100px] rounded-lg p-1 bg-gray-900 cursor-pointer border-2  ${
            traitId === trait.id.toString()
              ? "border-[#FDCB3F] "
              : "border-transparent"
          }`}
          onClick={() => {
            addSearchParam("trait", trait.id.toString());
          }}
        >
          <img
            src={`data:image/svg+xml;base64,${trait.svg}`}
            alt={trait.name}
            className="w-full h-full rounded-[2px]"
          />
        </div>
      ))}
    </div>
  );
};

export default TraitGridUI;
