"use client";

import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import AnimatedTabsVerticalHeadless from "@/components/AnimatedTabsVerticalHeadless";

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
  const typeQuery = useNomBuilderContext((state) => state.typeQuery);
  const setTypeQuery = useNomBuilderContext((state) => state.setTypeQuery);
  const onTabChange = (tab: string) => {
    setTypeQuery(tab);
  };

  return (
    <AnimatedTabsVerticalHeadless
      tabs={tabs}
      onTabChange={onTabChange}
      activeTab={typeQuery || "all"}
      setActiveTab={setTypeQuery}
    />
  );
}

export default AnimatedTabsVertical;
