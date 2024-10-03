import { useQuery } from "@tanstack/react-query";
import getTraitById from "../actions/getTraitById";

const TraitViewer = ({ traitId }: { traitId: string }) => {
  const { data: trait } = useQuery({
    queryKey: ["trait", traitId],
    queryFn: () => getTraitById(Number(traitId)),
  });

  return (
    <div className="p-2.5 bg-[#222] rounded-xl w-full">
      <h5 className="pangram-sans font-bold text-lg">{trait?.name}</h5>
      <div className="flex flex-row space-x-2 mt-6">
        <div className="w-1/2 flex flex-col">
          <h3 className="pangram-sans-compact font-bold text-sm">Creator</h3>
          <div className="w-full flex flex-row space-x-2 items-center mt-1">
            <span className="h-5 w-5 rounded-full bg-[#999] block"></span>
            <h3 className="pangram-sans-compact font-bold text-sm text-[#E0DDDD]">
              {trait?.name}
            </h3>
          </div>
        </div>
        <div className="w-1/2 flex flex-col">
          <h3 className="pangram-sans-compact font-bold text-sm">Collection</h3>
          <div className="w-full flex flex-row space-x-2 items-center mt-1">
            <span className="h-5 w-5 rounded-full bg-[#999] block"></span>
            <h3 className="pangram-sans-compact font-bold text-sm text-[#E0DDDD]">
              {trait?.name}
            </h3>
          </div>
        </div>
      </div>
      <div className="flex flex-row space-x-2 mt-4 justify-between h-[100px]">
        <p className="pangram-sans w-3/4">
          Here is where the trait description would go. Here is where the trait
          description would go. Here is where the trait description would go.
          Here is where the trait description would go. Here is where the trait
          description would go.
        </p>
        <div className="font-bold pangram-sans-compact text-black text-sm bg-[#E3EDE3] rounded-full px-2 py-1 self-end cursor-pointer">
          More info
        </div>
      </div>
    </div>
  );
};

export default TraitViewer;
