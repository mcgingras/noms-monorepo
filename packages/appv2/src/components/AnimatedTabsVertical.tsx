"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAddSearchParam } from "@/hooks/useAddSearchParam";

let tabs = [
  { id: "all", label: "Everything" },
  { id: "glasses", label: "Glasses" },
  { id: "head", label: "Head" },
  { id: "body", label: "Body" },
  { id: "accessory", label: "Accessory" },
  { id: "background", label: "Background" },
  { id: "wildcard", label: "Wildcard" },
];

function AnimatedTabs() {
  let [activeTab, setActiveTab] = useState(tabs[0].id);
  const addSearchParam = useAddSearchParam();

  return (
    <div className="flex flex-col space-y-1 bg-gray-1000 rounded h-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            addSearchParam("type", tab.id);
          }}
          className={`${
            activeTab === tab.id ? "" : "hover:text-white/60"
          } relative rounded-full px-3 py-1.5 text-white transition focus-visible:outline-2 pangram-sans-compact font-bold text-sm`}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeTab === tab.id && (
            <motion.span
              layoutId="tabsVerticalBubble"
              className="absolute inset-0 z-0 bg-blue-500 text-black mix-blend-lighten"
              style={{ borderRadius: 4 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default AnimatedTabs;
