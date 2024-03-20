import HeadIcon from "@/components/icons/HeadIcon";
import BodyIcon from "@/components/icons/BodyIcon";
import AccessoryIcon from "@/components/icons/AccessoryIcon";
import GlassesIcon from "@/components/icons/GlassesIcon";
import BackgroundIcon from "@/components/icons/BackgroundIcon";

const TraitSelector = () => {
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
    <div className="bg-gray-100 p-6 rounded-lg">
      <div className="flex flex-row justify-between">
        <BackgroundIcon className="h-16 w-16 text-neutral-300" />
        <GlassesIcon className="h-16 w-16 text-neutral-300" />
        <AccessoryIcon className="h-16 w-16 text-neutral-300" />
        <HeadIcon className="h-16 w-16 text-neutral-400" />
        <BodyIcon className="h-16 w-16 text-neutral-300" />
      </div>
    </div>
  );
};

export default TraitSelector;
