import Image from "next/image";
import { NomTrait } from "@/types/trait";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import {
  cn,
  hooklessIsTraitEquipped,
  hooklessIsTraitStaged,
} from "@/lib/utils";
import { Trait } from "@/types/trait";
import ShirtIcon from "@/components/icons/Shirt";

const UnEquipTraitAction = ({ trait }: { trait: Trait }) => {
  const setEquippedTraitAsUnequipped = useNomBuilderContext(
    (state) => state.setEquippedTraitAsUnequipped
  );
  const unequipTrait = (trait: Trait) => {
    setEquippedTraitAsUnequipped(trait);
  };

  return (
    <div
      className="h-[23px] w-[23px] bg-[#222] rounded-[6px] absolute bottom-1 left-1 flex items-center justify-center p-1 group-hover:opacity-100 opacity-0 transition-all"
      onClick={(e) => {
        e.stopPropagation();
        unequipTrait(trait);
      }}
    >
      <ShirtIcon className="text-white" filled={false} />
    </div>
  );
};

const EquipTraitAction = ({ trait }: { trait: Trait }) => {
  const setUnequippedTraitAsEquipped = useNomBuilderContext(
    (state) => state.setUnequippedTraitAsEquipped
  );

  const equipTrait = (trait: Trait) => {
    setUnequippedTraitAsEquipped(trait);
  };

  return (
    <div
      className="h-[23px] w-[23px] bg-[#222] rounded-[6px] absolute bottom-1 left-1 flex items-center justify-center p-1 group-hover:opacity-100 opacity-0 transition-all"
      onClick={(e) => {
        e.stopPropagation();
        equipTrait(trait);
      }}
    >
      <ShirtIcon className="text-white" filled={true} />
    </div>
  );
};

// TODO: WRONG -- SHOULD NOT BE A PENDING TRAIT BECAUSE WE ALREADY OWN IT
const AddTraitAction = ({ trait }: { trait: Trait }) => {
  const addPendingTrait = useNomBuilderContext(
    (state) => state.addPendingTrait
  );

  const addTrait = (trait: Trait) => {
    addPendingTrait(trait);
  };

  return (
    <div
      className="h-[23px] w-[23px] bg-[#222] rounded-[6px] absolute bottom-1 left-1 flex items-center justify-center p-1 group-hover:opacity-100 opacity-0 transition-all"
      onClick={(e) => {
        e.stopPropagation();
        addTrait(trait);
      }}
    >
      <ShirtIcon className="text-white" filled={true} />
    </div>
  );
};

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
  const layers = useNomBuilderContext((state) => state.layers);
  const isActive = nomTrait.trait.id === selectedTraitId;
  const isStaged = hooklessIsTraitStaged(layers, nomTrait.trait);
  const isEquipped = hooklessIsTraitEquipped(layers, nomTrait.trait);

  return (
    <div
      className={cn(
        "min-w-[100px] aspect-square rounded-lg bg-[#2d2d2d] relative z-10 cursor-pointer ring-offset-4 ring-0 hover:ring-[3px] ring-transparent hover:ring-[#FDCB3F] transition-all group",
        isActive ? "ring-[3px] ring-[#FDCB3F]" : "ring-transparent",
        isStaged
          ? "ring-offset-[#2B83F6]"
          : isEquipped
            ? "ring-offset-[#5648ED]"
            : "ring-offset-gray-900"
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
      {isStaged ? (
        <EquipTraitAction trait={nomTrait.trait} />
      ) : isEquipped ? (
        <UnEquipTraitAction trait={nomTrait.trait} />
      ) : (
        <AddTraitAction trait={nomTrait.trait} />
      )}
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
      if (typeQuery === "all" || typeQuery === "") return true;
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

  if (rows.length === 0) {
    return (
      <ClosetRow key={"empty-closet"} nomTraits={[]} onClickTrait={() => {}} />
    );
  }

  return (
    <>
      {rows.map((row: any[], index: number) => (
        <ClosetRow key={index} nomTraits={row} onClickTrait={onClickTrait} />
      ))}
    </>
  );
};

export default ClosetList;
