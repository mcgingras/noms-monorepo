import { useQuery } from "@tanstack/react-query";
import getTraitById from "../actions/getTraitById";

const TraitViewer = ({ traitId }: { traitId: string }) => {
  const { data: trait } = useQuery({
    queryKey: ["trait", traitId],
    queryFn: () => getTraitById(Number(traitId)),
  });

  console.log("tv", trait);

  return (
    <div className="p-2 bg-[#333] rounded-xl w-full">
      <h5 className="pangram-sans font-bold">{trait?.name}</h5>
      <div className="flex flex-row space-x-2 mt-4">
        <div className="w-1/2 flex flex-col">
          <h3>Creator</h3>
          <div className="w-full flex flex-row space-x-2 items-center mt-1">
            <span className="h-5 w-5 rounded-full bg-[#999] block"></span>
            <h3>{trait?.name}</h3>
          </div>
        </div>
        <div className="w-1/2 flex flex-col">
          <h3>Collection</h3>
          <div className="w-full flex flex-row space-x-2 items-center mt-1">
            <span className="h-5 w-5 rounded-full bg-[#999] block"></span>
            <h3>{trait?.name}</h3>
          </div>
        </div>
      </div>
      <div className="flex flex-row space-x-2 mt-4 justify-between">
        <p>Here is where the trait description would go.</p>
        <div className="text-black text-xs bg-white rounded-full px-2 py-1">
          More info
        </div>
      </div>
    </div>
  );
};

export default TraitViewer;
