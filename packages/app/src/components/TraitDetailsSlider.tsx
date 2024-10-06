"use client";

import CloseIcon from "@/components/icons/CloseIcon";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import getTraitById from "@/actions/getTraitById";
import Image from "next/image";

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

const slideVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
  exit: { x: "100%" },
};

const TraitDetailsSlider = () => {
  const selectedTraitId = useNomBuilderContext(
    (state) => state.selectedTraitId
  );
  const setShowingSelectedTraitDetails = useNomBuilderContext(
    (state) => state.setShowingSelectedTraitDetails
  );

  const { data: trait } = useQuery({
    queryKey: ["trait", selectedTraitId],
    queryFn: () => getTraitById(Number(selectedTraitId)),
    enabled: !!selectedTraitId,
  });

  console.log(trait);

  return (
    <>
      {/* makes the underlayer unclickable */}
      <div className="absolute h-[calc(100%-16px)] w-full block inset-0 top-0 left-0 z-[100]"></div>
      <motion.div
        className="absolute h-[calc(100%-16px)] w-2/3 top-2 right-[10px] bg-[#222] z-[100] rounded-[10px] shadow-lg p-4 flex flex-col"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideVariants}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl pangram-sans font-bold">{trait?.name}</h2>
          <div
            className="flex flex-row items-center gap-1.5 bg-[#E3EDE3] text-[#222] rounded-full px-2 py-1 cursor-pointer"
            onClick={() => setShowingSelectedTraitDetails(false)}
          >
            <span className="bg-[#222] p-1 rounded-full">
              <CloseIcon className="w-4 h-4 text-white" />
            </span>
            <button className="text-sm pangram-sans font-bold">Close</button>
          </div>
        </div>
        <div className="mt-4 min-h-[200px] w-full bg-[#1A1A1A] rounded-xl relative">
          <Image
            src={`data:image/svg+xml;base64,${trait.svg}`}
            alt="Trait"
            fill
            className="absolute"
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-x-2">
          <div className="flex flex-col">
            <h3 className="text-sm pangram-sans-compact font-bold">Creator</h3>
            <p>John Doe</p>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm pangram-sans-compact font-bold">
              Collection
            </h3>
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
        <div className="mt-4 flex flex-row items-center justify-center">
          <p className="pangram-sans-compact text-sm font-bold">
            Currently previewing
          </p>
        </div>
        <div className="mt-4 flex flex-col">
          <button className="w-full bg-[#6A6969] rounded-lg p-2 pangram-sans font-bold text-sm">
            Add to layer
          </button>
        </div>
        <div className="mt-6 flex flex-col flex-1 overflow-hidden relative">
          <h3 className="text-sm pangram-sans-compact font-bold text-[#7C7C7C]">
            More about this item
          </h3>
          <p className="flex-1 pangram-sans overflow-y-scroll">
            lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum
            dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit
            amet, consectetur adipiscing elit. lorem ipsum dolor sit amet,
            consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur
            adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing
            elit. lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem
            ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor
            sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet,
            consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur
            adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing
            elit. lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem
            ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor
            sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet,
            consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur
            adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing
            elit. lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem
            ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor
            sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet,
            consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur
            adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing
            elit. lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem
            ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor
            sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet,
            consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur
            adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing
            elit. lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem
            ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <div className="absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-[#222] to-transparent pointer-events-none"></div>
        </div>
      </motion.div>
    </>
  );
};

export default TraitDetailsSlider;
