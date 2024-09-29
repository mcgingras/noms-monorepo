"use client";

import AnimatedTabsVertical from "@/components/AnimatedTabsVertical";
import { motion } from "framer-motion";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getTraits } from "@/actions/getTraits";
import { useSearchParams } from "next/navigation";
import TraitCard from "./TraitCard";
import SearchInput from "./SearchInput";

const MallTab = ({ onPartClick }: { onPartClick: (part: any) => void }) => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const { data } = useSuspenseQuery({
    queryKey: ["traits-query", type || "all"],
    queryFn: async () => {
      const traits = await getTraits(type || "all");
      return { traits };
    },
  });

  const { traits } = data;

  return (
    <motion.div
      key={"mall-tab"}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-4 h-full flex flex-row space-x-2 w-full overflow-hidden"
    >
      <AnimatedTabsVertical />
      <div className="flex-1 flex flex-col">
        <SearchInput />
        <div className="w-full bg-gray-900 p-2 rounded-lg mt-2 flex-1 overflow-y-scroll">
          <div className="flex flex-row flex-wrap gap-2">
            {traits.map((trait: any) => (
              <TraitCard
                key={trait.id}
                trait={trait}
                isSelected={false}
                onClick={() => {
                  onPartClick(trait);
                }}
              />
            ))}
          </div>
        </div>
        <hr className="mt-2 border-gray-900" />
        <div className="bg-gray-900 mt-2 rounded-lg p-2 h-[150px]">
          <h3 className="pangram-sans font-bold">Glasses blue green square</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default MallTab;
