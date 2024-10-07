import TraitCard from "@/components/TraitCard";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import { Trait } from "@/types/trait";
const ChangingRoomList = () => {
  const typeQuery = useNomBuilderContext((state) => state.typeQuery);
  const searchQuery = useNomBuilderContext((state) => state.traitSearchQuery);
  const pendingTraits = useNomBuilderContext((state) => state.pendingTraits);
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

  if (filteredTraits.length === 0 && searchQuery === "" && typeQuery === "")
    return null;

  return (
    <div className="w-full bg-gray-900 p-2 rounded-lg mt-2 flex-1 overflow-y-scroll">
      <h3 className="pangram-sans-compact font-bold">Changing room</h3>
      {filteredTraits.length === 0 ? (
        <div className="flex flex-row justify-center items-center h-full">
          <p className="pangram-sans text-gray-400 pb-6">No traits found</p>
        </div>
      ) : (
        <div className="mt-2 flex flex-row flex-wrap gap-4">
          {filteredTraits.map((trait: Trait) => (
            <TraitCard
              key={trait.id}
              trait={trait}
              isActive={false}
              onClickTrait={() => {
                setSelectedTraitId(trait.id.toString());
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChangingRoomList;
