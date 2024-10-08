"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import SoftArrow from "@/components/icons/SoftArrow";

function AnimatedTabsVerticalHeadless({
  tabs,
  onTabChange,
}: {
  tabs: { id: string; label: string }[];
  onTabChange: (tab: string) => void;
}) {
  let [transitionComplete, setTransitionComplete] = useState(true);
  let [activeTab, setActiveTab] = useState(tabs[0].id);

  const goToNextTab = (currentTab: string) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTab);
    const nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
    setActiveTab(tabs[nextIndex].id);
    onTabChange(tabs[nextIndex].id);
  };

  const goToPreviousTab = (currentTab: string) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTab);
    const previousIndex =
      currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    setActiveTab(tabs[previousIndex].id);
    onTabChange(tabs[previousIndex].id);
  };

  return (
    <div className="w-[140px] h-full bg-gray-900 rounded-lg p-2 flex flex-col space-y-2">
      <span
        className="bg-gray-800 rounded-full flex items-center justify-center py-1 cursor-pointer"
        onClick={() => goToPreviousTab(activeTab)}
      >
        <SoftArrow direction="up" />
      </span>
      <div className="flex flex-col space-y-1 bg-gray-1000 rounded h-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setTransitionComplete(false);
              setActiveTab(tab.id);
              onTabChange(tab.id);
              setTimeout(() => {
                setTransitionComplete(true);
              }, 100);
            }}
            className={`${
              activeTab === tab.id && transitionComplete
                ? "text-black"
                : "text-white hover:text-white/60"
            } relative rounded-full px-3 py-1.5 transition focus-visible:outline-2 pangram-sans-compact font-bold text-sm`}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <p className="relative z-10">{tab.label}</p>
            {activeTab === tab.id && (
              <motion.span
                layoutId="tabsVerticalBubble"
                className="absolute inset-0 z-0 bg-[#FDCB3F]"
                style={{ borderRadius: 4 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>
      <span
        className="bg-gray-800 rounded-full flex items-center justify-center py-1 cursor-pointer"
        onClick={() => goToNextTab(activeTab)}
      >
        <SoftArrow direction="down" />
      </span>
    </div>
  );
}

export default AnimatedTabsVerticalHeadless;
