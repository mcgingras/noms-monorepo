"use client";

import { useState } from "react";
import AnimatedTabsVertical from "@/components/AnimatedTabsVertical";
import { motion } from "framer-motion";
import ChangingRoomRow from "../components/ChangingRoomRow";
import HangerIcon from "@/components/icons/Hanger";
import SearchInput from "./SearchInput";

const ClosetTab = ({ pendingParts }: { pendingParts: any[] }) => {
  const [selectedPart, setSelectedPart] = useState<any | null>(pendingParts[0]);
  const ownedParts = [];

  return (
    <motion.div
      key={"tab-1"}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-4 h-full flex flex-row space-x-2 w-full"
    >
      <AnimatedTabsVertical />
      <div className="flex-1 flex flex-col">
        <SearchInput />
        {pendingParts.length > 0 && (
          <div className="w-full bg-gray-900 p-2 rounded-lg mt-2">
            <h3 className="pangram-sans-compact font-bold">Pending changes</h3>
            <div className="mt-2 flex flex-row flex-wrap gap-2">
              {pendingParts.map((part) => (
                <div
                  key={part.id}
                  className="w-[15%] aspect-square rounded-lg bg-gray-800 cursor-pointer"
                  onClick={() => setSelectedPart(part)}
                >
                  <img
                    src={`data:image/svg+xml;base64,${part.svg}`}
                    alt={part.name}
                    className={`rounded-lg border-blue-500 border-4 ${
                      selectedPart === part
                        ? "ring ring-offset-0 ring-yellow-500"
                        : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <hr className="mt-2 border-gray-900" />
        <div className="pt-2">
          <h3 className="pangram-sans-compact font-bold">Closet</h3>
          {ownedParts.length > 0 ? (
            <>
              <ChangingRoomRow />
              <ChangingRoomRow />
              <ChangingRoomRow />
            </>
          ) : (
            <div className="py-24 px-12">
              <span className="text-[#454545] mx-auto flex flex-row items-center justify-center mb-4">
                <HangerIcon />
              </span>
              <p className="text-white pangram-sans font-bold text-center mb-2">
                This nom has an empty closet! Go to the mall or special orders
                tab to find stuff to buy and wear.
              </p>
              <p className="text-[#939393] pangram-sans text-xs text-center">
                Items in the changing room must be minted to be owned.
              </p>
            </div>
          )}
        </div>
        {selectedPart && (
          <div className="bg-gray-900 mt-2 rounded-lg p-2 flex-1">
            <h3 className="pangram-sans font-bold">{selectedPart.name}</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ClosetTab;
