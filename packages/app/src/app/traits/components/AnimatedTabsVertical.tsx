"use client";

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
  //   const setTypeQuery = useNomBuilderContext((state) => state.setTypeQuery);
  const onTabChange = (tab: string) => {
    // setTypeQuery(tab);
    console.log(tab);
  };

  return <AnimatedTabsVerticalHeadless tabs={tabs} onTabChange={onTabChange} />;
}

export default AnimatedTabsVertical;
