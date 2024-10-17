"use client";

import AnimatedTabsVerticalHeadless from "@/components/AnimatedTabsVerticalHeadless";
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

function AnimatedTabsVertical() {
  const addSearchParam = useAddSearchParam();
  const [activeTab, setActiveTab] = useState("all");
  const onTabChange = (tab: string) => {
    addSearchParam("type", tab);
    setActiveTab(tab);
  };

  return (
    <AnimatedTabsVerticalHeadless
      layoutKey="tabsVerticalTraitsPage"
      tabs={tabs}
      onTabChange={onTabChange}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
}

export default AnimatedTabsVertical;
