"use client";

import { Tab, TabList } from "@headlessui/react";
import { motion } from "framer-motion";
import { useState } from "react";

let tabs = [
  { id: "Closet", label: "Closet" },
  { id: "Traits", label: "Shopping center" },
  //   { id: "Limited edition", label: "Limited edition" },
];

function AnimatedTabs() {
  let [transitionComplete, setTransitionComplete] = useState(true);
  let [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <TabList className="flex space-x-1 bg-gray-900 rounded-full">
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          onClick={() => {
            setTransitionComplete(false);
            setActiveTab(tab.id);
            setTimeout(() => {
              setTransitionComplete(true);
            }, 100);
          }}
          className={`${
            activeTab === tab.id && transitionComplete
              ? "text-black"
              : "text-white hover:text-white/60"
          } relative rounded-full px-3 py-1.5 font-medium transition oziksoft text-xl`}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <p className="relative z-10">{tab.label}</p>
          {activeTab === tab.id && (
            <motion.span
              layoutId="bubble"
              className="absolute inset-0 z-0 bg-[#FDCB3F]"
              style={{ borderRadius: 9999 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </Tab>
      ))}
    </TabList>
  );
}

export default AnimatedTabs;
