"use client";

import { Tab, TabList } from "@headlessui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";

let tabs = [
  { id: "Closet", label: "Closet" },
  { id: "Traits", label: "Shopping center" },
  //   { id: "New", label: "New traits" },
];

function AnimatedTabs() {
  let [transitionComplete, setTransitionComplete] = useState(true);
  let [activeTab, setActiveTab] = useState(tabs[0].id);
  const setTraitSearchQuery = useNomBuilderContext(
    (state) => state.setTraitSearchQuery
  );
  const setTypeQuery = useNomBuilderContext((state) => state.setTypeQuery);

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
            setTraitSearchQuery("");
            setTypeQuery("all");
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
              layoutId="mall"
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
