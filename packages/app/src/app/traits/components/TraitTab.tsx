"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAddSearchParam } from "@/hooks/useAddSearchParam";
import { useAccount } from "wagmi";

let tabs = [
  { id: "All traits", label: "All traits" },
  { id: "My Traits", label: "My traits" },
];

function AnimatedTabs() {
  let [activeTab, setActiveTab] = useState(tabs[0].id);
  const addSearchParam = useAddSearchParam();
  const { address } = useAccount();
  return (
    <div className="flex space-x-1 bg-gray-900 rounded-full">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            if (tab.id === "My Traits") {
              addSearchParam("creator", address || "");
            } else {
              addSearchParam("creator", "");
            }
          }}
          className={`${
            activeTab === tab.id ? "" : "hover:text-white/60"
          } relative rounded-full px-3 py-1.5 font-medium text-white transition focus-visible:outline-2 oziksoft text-xl cursor-pointer`}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeTab === tab.id && (
            <motion.span
              layoutId="traits"
              //   bg-[#FDCB3F]
              className="absolute inset-0 z-0 bg-blue-500 text-black mix-blend-lighten"
              style={{ borderRadius: 9999 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {tab.label}
        </div>
      ))}
    </div>
  );
}

export default AnimatedTabs;
