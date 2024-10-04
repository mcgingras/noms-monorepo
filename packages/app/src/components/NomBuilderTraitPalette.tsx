import { useState, Fragment } from "react";
import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedTabs from "@/components/AnimatedTabs";
import AnimatedTabsVertical from "@/components/AnimatedTabsVertical";
import SearchInput from "@/components/SearchInput";
import NomBuilderMallTabContent from "./NomBuilderMallTabContent";
import NomBuilderClosetTabContent from "./NomBuilderClosetTabContent";
import Cart from "./Cart";

const NomBuilderTraitPalette = ({ size }: { size: "small" | "large" }) => {
  const [page, setPage] = useState<"cart" | "shop">("shop");
  return (
    <motion.div
      className="relative p-4 h-full overflow-hidden"
      initial={{ width: "880px" }}
      animate={{ width: size === "small" ? 0 : "880px" }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1], // Custom bezier curve
      }}
    >
      <TabGroup className="flex flex-col h-full">
        <div className="flex flex-row justify-between w-full">
          <AnimatedTabs />
          <Cart
            onClick={() => {
              setPage("cart");
            }}
          />
        </div>
        <div className="mt-4 flex-1 flex flex-row space-x-2 w-full overflow-hidden">
          <AnimatedTabsVertical />
          <div className="flex-1 flex flex-col h-full">
            <SearchInput />
            <AnimatePresence mode="wait">
              <TabPanels as={Fragment}>
                <TabPanel as={Fragment} unmount={true}>
                  <NomBuilderClosetTabContent key={"tab-1"} />
                </TabPanel>
                <TabPanel as={Fragment} unmount={true}>
                  <NomBuilderMallTabContent key={"tab-2"} />
                </TabPanel>
              </TabPanels>
            </AnimatePresence>
          </div>
        </div>
      </TabGroup>
    </motion.div>
  );
};

export default NomBuilderTraitPalette;
