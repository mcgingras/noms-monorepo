import Image from "next/image";
import { NomTrait } from "@/types/trait";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import { cn } from "@/lib/utils";
import { Trait } from "@/types/trait";
import { useSearchParams } from "next/navigation";

const ClosetItem = ({
  nomTrait,
  onClickTrait,
}: {
  nomTrait: NomTrait;
  onClickTrait: (trait: Trait) => void;
}) => {
  const selectedTraitId = useNomBuilderContext(
    (state) => state.selectedTraitId
  );

  return (
    <div
      className={cn(
        "min-w-[100px] aspect-square rounded-lg bg-gray-800 relative z-10 cursor-pointer ring-offset-4 hover:ring-[3px] hover:ring-[#FDCB3F] transition-all",
        nomTrait.equipped ? "ring-offset-blue-500" : "ring-offset-gray-900",
        nomTrait.trait.id === selectedTraitId
          ? "ring-[3px] ring-[#FDCB3F]"
          : "ring-0 ring-transparent"
      )}
      onClick={() => {
        onClickTrait(nomTrait.trait);
      }}
    >
      <div className="absolute top-[-16px] left-[45%] flex flex-col">
        <div className="h-8 w-2 rounded bg-[#3E3D3D] z-20"></div>
        <span className="h-4 w-4 rounded-full bg-black mt-[-10px] ml-[-4px] z-10"></span>
      </div>
      <Image
        src={`data:image/svg+xml;base64,${nomTrait.trait.svg}`}
        alt="Rendered nom"
        className="bottom-0 absolute"
        fill
      />
    </div>
  );
};

const ClosetRow = ({
  nomTraits,
  onClickTrait,
}: {
  nomTraits: NomTrait[];
  onClickTrait: (trait: Trait) => void;
}) => {
  return (
    <div className="mt-6 flex flex-row flex-wrap gap-4 relative px-2">
      {nomTraits.map((nomTrait) => (
        <ClosetItem
          key={nomTrait.id}
          nomTrait={nomTrait}
          onClickTrait={onClickTrait}
        />
      ))}
      <div className="h-12 w-full bg-gray-900 rounded absolute left-0 top-[-20px]"></div>
    </div>
  );
};

const ClosetList = ({
  onClickTrait,
}: {
  onClickTrait: (trait: Trait) => void;
}) => {
  const typeQuery = useNomBuilderContext((state) => state.typeQuery);
  const searchQuery = useNomBuilderContext((state) => state.traitSearchQuery);
  const ownedTraits = useNomBuilderContext((state) => state.ownedTraits);

  if (ownedTraits.length === 0) {
    return (
      <ClosetRow key={"empty-closet"} nomTraits={[]} onClickTrait={() => {}} />
    );
  }

  const filteredTraits = ownedTraits
    .filter((trait) => {
      if (typeQuery === "all") return true;
      return trait.trait.type === typeQuery;
    })
    .filter((trait) => {
      if (searchQuery === "") return true;
      return trait.trait.name
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
    });

  // turn traits from array into array of length 6 arrays
  const rows = filteredTraits.reduce((acc, trait, index) => {
    if (index % 6 === 0) {
      acc.push([trait]);
    } else {
      acc[acc.length - 1].push(trait);
    }
    return acc;
  }, [] as NomTrait[][]);

  return (
    <>
      {rows.map((row: any[], index: number) => (
        <ClosetRow key={index} nomTraits={row} onClickTrait={onClickTrait} />
      ))}
    </>
  );
};

export default ClosetList;
