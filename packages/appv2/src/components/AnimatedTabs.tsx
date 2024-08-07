"use client";

import { motion } from "framer-motion";
import { useState } from "react";

let tabs = [
  { id: "Closet", label: "Closet" },
  { id: "Mall", label: "Mall" },
  { id: "Limited edition", label: "Limited edition" },
];

function AnimatedTabs() {
  let [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="flex space-x-1 bg-gray-900 rounded-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`${
            activeTab === tab.id ? "" : "hover:text-white/60"
          } relative rounded-full px-3 py-1.5 font-medium text-white transition focus-visible:outline-2 oziksoft text-xl`}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeTab === tab.id && (
            <motion.span
              layoutId="bubble"
              //   bg-[#FDCB3F]
              className="absolute inset-0 z-0 bg-blue-500 text-black mix-blend-lighten"
              style={{ borderRadius: 9999 }}
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
