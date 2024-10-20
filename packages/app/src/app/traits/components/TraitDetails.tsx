import { useQuery } from "@tanstack/react-query";
import getTraitById from "@/actions/getTraitById";
import getTraitStatsById from "@/actions/getTraitStatsById";
import CloseIcon from "@/components/icons/CloseIcon";
import { useAddSearchParam } from "@/hooks/useAddSearchParam";
import EthereumIcon from "@/components/icons/Ethereum";
import AvatarAddress from "@/components/AvatarAddress";
import { motion } from "framer-motion";

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

  const { data: traitStats } = useQuery({
    queryKey: ["traitStats", selectedTraitId],
    queryFn: () => getTraitStatsById(selectedTraitId),
  });

  if (isLoading) {
    return <div className="p-4 flex flex-col h-full"></div>;
  }

  return (
    <motion.div
      className="p-4 flex flex-col h-full"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-2xl pangram-sans-compact font-bold">
            {data.name}
          </h2>
          <div className="flex flex-row gap-x-2">
            <div className="flex flex-row gap-x-1 items-center">
              <EthereumIcon className="w-4 h-4 text-white" />
              <span className="text-lg pangram-sans-compact font-bold">
                Free
              </span>
            </div>
            <button className="text-sm pangram-sans-compact font-bold text-white bg-blue-500 px-2 py-1 rounded-lg">
              Buy
            </button>
          </div>
        </div>
        <span
          className="bg-[#111] flex items-center justify-center rounded-full cursor-pointer h-8 w-8"
          onClick={() => addSearchParam("traitId", "")}
        >
          <CloseIcon className="w-4 h-4 text-white" />
        </span>
      </div>
      <div className="w-full min-h-[200px] h-[200px] mt-4 bg-gray-1000 rounded-lg p-2">
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
          {data?.creator && <AvatarAddress address={data?.creator} />}
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
        <StatCard title="Supply" value="TBD" />
        <StatCard title="Bought" value={traitStats?.bought} />
        <StatCard title="Wearing" value={traitStats?.wearing} />
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
    </motion.div>
  );
};

export default TraitDetails;
