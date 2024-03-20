import { useState } from "react";
import HeadIcon from "@/components/icons/HeadIcon";
import BodyIcon from "@/components/icons/BodyIcon";
import AccessoryIcon from "@/components/icons/AccessoryIcon";
import GlassesIcon from "@/components/icons/GlassesIcon";
import BackgroundIcon from "@/components/icons/BackgroundIcon";
import { useTraits } from "@/models/traits/hooks";
import { TraitType } from "@/models/traits/types";

const SelectTraitIcon = ({
  traitType,
  selectedTraitType,
  setSelectedTraitType,
  Icon,
}: {
  traitType: TraitType;
  selectedTraitType: string;
  setSelectedTraitType: (type: TraitType) => void;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}) => {
  return (
    <span
      onClick={() => setSelectedTraitType(traitType)}
      className="cursor-pointer"
    >
      <Icon
        className={`h-16 w-16 ${
          selectedTraitType === traitType
            ? "text-neutral-500"
            : "text-neutral-300 hover:text-neutral-400"
        }  transition-colors`}
      />
    </span>
  );
};

const TraitSelector = () => {
  const { traits } = useTraits();
  const [selectedTraitType, setSelectedTraitType] = useState<TraitType>(
    TraitType.HEAD
  );

  const traitsByType = traits.filter(
    (trait) => trait.type === selectedTraitType
  );
  const notActive = false;

  if (notActive) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">
          Cannot view traits until this nom is activated.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg h-full">
      <div className="flex flex-row justify-between">
        <SelectTraitIcon
          traitType={TraitType.BACKGROUND}
          selectedTraitType={selectedTraitType}
          setSelectedTraitType={setSelectedTraitType}
          Icon={BackgroundIcon}
        />
        <SelectTraitIcon
          traitType={TraitType.GLASSES}
          selectedTraitType={selectedTraitType}
          setSelectedTraitType={setSelectedTraitType}
          Icon={GlassesIcon}
        />
        <SelectTraitIcon
          traitType={TraitType.ACCESSORY}
          selectedTraitType={selectedTraitType}
          setSelectedTraitType={setSelectedTraitType}
          Icon={AccessoryIcon}
        />
        <SelectTraitIcon
          traitType={TraitType.HEAD}
          selectedTraitType={selectedTraitType}
          setSelectedTraitType={setSelectedTraitType}
          Icon={HeadIcon}
        />
        <SelectTraitIcon
          traitType={TraitType.BODY}
          selectedTraitType={selectedTraitType}
          setSelectedTraitType={setSelectedTraitType}
          Icon={BodyIcon}
        />
      </div>
      <section className="grid grid-cols-4 gap-4 mt-6 overflow-y-scroll">
        {traitsByType.map((trait, idx) => {
          return (
            <img
              className="rounded-md"
              src={`data:image/svg+xml;base64,${trait.svg}`}
            />
          );
        })}
      </section>
    </div>
  );
};

export default TraitSelector;
