"use client";

import { Trait } from "@/types/trait";
const TraitGridUI = ({
  traits,
  selectedTrait,
  setSelectedTrait,
}: {
  traits: Trait[];
  selectedTrait: Trait | null;
  setSelectedTrait: (trait: Trait | null) => void;
}) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 content-start">
      {traits.map((trait) => (
        <div
          key={trait.id}
          className={`aspect-square flex-shrink-0 rounded-lg p-1 bg-gray-900 cursor-pointer border-2 ${
            selectedTrait?.id.toString() === trait.id.toString()
              ? "border-[#FDCB3F] "
              : "border-transparent"
          }`}
          onClick={() => {
            setSelectedTrait(trait);
          }}
        >
          <img
            src={`data:image/svg+xml;base64,${trait.svg}`}
            alt={trait.name}
            className="w-full h-full rounded-[2px] object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default TraitGridUI;
