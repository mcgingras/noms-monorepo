import { useQuery } from "@tanstack/react-query";
import getTraitById from "@/actions/getTraitById";
import CloseIcon from "@/components/icons/CloseIcon";
import { useAddSearchParam } from "@/hooks/useAddSearchParam";

const StatCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex flex-col gap-y-1 p-2 rounded-[6px] bg-[#2C2C2C] items-center">
      <h3 className="text-sm pangram-sans font-medium text-[#B5B5B5]">
        {title}
      </h3>
      <p className="text-[18px] pangram-sans font-bold">{value}</p>
    </div>
  );
};

const TraitDetails = ({ selectedTraitId }: { selectedTraitId: any }) => {
  const addSearchParam = useAddSearchParam();
  const { data, isLoading } = useQuery({
    queryKey: ["trait", selectedTraitId],
    queryFn: () => getTraitById(selectedTraitId),
  });

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex flex-row justify-between">
        <h2 className="text-xl pangram-sans-compact font-bold">{data?.name}</h2>
        <span
          className="bg-[#111] flex items-center justify-center rounded-full cursor-pointer h-8 w-8"
          onClick={() => addSearchParam("traitId", "")}
        >
          <CloseIcon className="w-4 h-4 text-white" />
        </span>
      </div>
      <div className="w-full h-[250px] mt-4 bg-gray-1000 rounded-lg p-2">
        {!isLoading && (
          <img
            src={`data:image/svg+xml;base64,${data?.svg}`}
            alt={data?.name}
            className="w-full h-full rounded-[2px]"
          />
        )}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-x-2">
        <div className="flex flex-col">
          <h3 className="text-sm pangram-sans-compact font-bold">Creator</h3>
          <p>John Doe</p>
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm pangram-sans-compact font-bold">Collection</h3>
          <p>1000</p>
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm pangram-sans-compact font-bold">
            Requirements
          </h3>
          <p>pill goes here</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-x-2">
        <StatCard title="Bought" value="1000" />
        <StatCard title="Wearing" value="1000" />
        <StatCard title="Wearing" value="1000" />
      </div>
      <div className="mt-6 flex flex-col flex-1 overflow-hidden relative">
        <h3 className="text-sm pangram-sans-compact font-bold text-[#7C7C7C]">
          More about this item
        </h3>
        <p className="flex-1 pangram-sans overflow-y-scroll">
          {data?.description}
        </p>
        <div className="absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-[#222] to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default TraitDetails;
