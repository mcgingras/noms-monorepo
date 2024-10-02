import Image from "next/image";
import AnimatedTabsVertical from "@/components/AnimatedTabsVertical";
import ClosetList from "./ClosetList";
import TraitViewer from "@/components/TraitViewer";
import SearchInput from "@/components/SearchInput";

const ClosetTab = ({
  pendingTraits,
  existingNomTraits,
  selectedTraitId,
}: {
  pendingTraits: any[];
  existingNomTraits: any[];
  selectedTraitId: string;
}) => {
  return (
    <>
      <AnimatedTabsVertical />
      <div className="flex-1 flex flex-col">
        <SearchInput />
        {pendingTraits.length > 0 && (
          <div className="w-full bg-gray-900 p-2 rounded-lg mt-2">
            <h3 className="pangram-sans-compact font-bold">Changing room</h3>
            <div className="mt-2 flex flex-row flex-wrap gap-2">
              {pendingTraits.map((part) => (
                <div
                  key={part.id}
                  className="min-w-[85px] aspect-square rounded-lg bg-gray-800 relative"
                >
                  <Image
                    src={`data:image/svg+xml;base64,${part.svg}`}
                    alt="Trait"
                    fill
                    className="absolute"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <hr className="mt-2 border-gray-900" />
        <div className="pt-2 flex-1">
          <h3 className="pangram-sans-compact font-bold">Closet</h3>
          <ClosetList traits={existingNomTraits} />
        </div>
        {selectedTraitId && <TraitViewer traitId={selectedTraitId} />}
      </div>
    </>
  );
};

export default ClosetTab;
