import TraitCard from "@/components/TraitCard";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import { Trait } from "@/types/trait";
import ShirtIcon from "@/components/icons/Shirt";

const RemoveTraitAction = ({ trait }: { trait: Trait }) => {
  const removeUnOwnedTrait = useNomBuilderContext(
    (state) => state.removeUnOwnedTrait
  );

  const unequipTrait = (trait: Trait) => {
    removeUnOwnedTrait(trait);
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

const ChangingRoomList = () => {
  const typeQuery = useNomBuilderContext((state) => state.typeQuery);
  const searchQuery = useNomBuilderContext((state) => state.traitSearchQuery);
  const pendingTraits = useNomBuilderContext((state) => state.pendingTraits);
  const selectedTraitId = useNomBuilderContext(
    (state) => state.selectedTraitId
  );
  const setSelectedTraitId = useNomBuilderContext(
    (state) => state.setSelectedTraitId
  );

  const filteredTraits = pendingTraits
    .filter((trait) => {
      if (typeQuery === "all" || typeQuery === "") return true;
      return trait.type === typeQuery;
    })
    .filter((trait) => {
      if (searchQuery === "") return true;
      return trait.name
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
    });

  return (
    <div className="w-full bg-gray-900 p-2 rounded-lg mt-2 flex-1 overflow-y-scroll">
      <h3 className="pangram-sans-compact font-bold">Changing room</h3>
      {filteredTraits.length === 0 ? (
        <div className="flex flex-row justify-center items-center h-full">
          <p className="pangram-sans text-gray-400 pb-6">Empty!</p>
        </div>
      ) : (
        <div className="mt-2 flex flex-row flex-wrap gap-4">
          {filteredTraits.map((trait: Trait) => (
            <TraitCard
              key={trait.id}
              trait={trait}
              isActive={selectedTraitId === trait.id}
              isStaged={true}
              onClickTrait={() => {
                setSelectedTraitId(trait.id.toString());
              }}
              actionComponent={<RemoveTraitAction trait={trait} />}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChangingRoomList;
