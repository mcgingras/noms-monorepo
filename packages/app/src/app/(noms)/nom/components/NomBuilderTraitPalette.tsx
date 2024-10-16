import { useState, Fragment } from "react";
import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedTabs from "@/components/AnimatedTabs";
import AnimatedTabsVertical from "./AnimatedTabsVertical";
import SearchInput from "@/components/SearchInput";
import NomBuilderMallTabContent from "./NomBuilderMallTabContent";
import NomBuilderClosetTabContent from "./NomBuilderClosetTabContent";
import Cart from "../../../../components/Cart";
import TraitDetailsSlider from "../../../../components/TraitDetailsSlider";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import WavyTab from "./WavyTab";

const NomBuilderTraitPalette = ({
  size,
  toggleSize,
}: {
  size: "small" | "large";
  toggleSize: () => void;
}) => {
  const [page, setPage] = useState<"cart" | "shop">("shop");
  const showingSelectedTraitDetails = useNomBuilderContext(
    (state) => state.showingSelectedTraitDetails
  );

  const contentVariants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: 0 },
  };

  return (
    <>
      <motion.div
        className="bg-transparent"
        initial={{ width: size === "small" ? "0px" : "880px" }}
        animate={{ width: size === "small" ? "0px" : "880px" }}
        transition={{
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1],
        }}
      ></motion.div>
      <motion.div
        className="absolute top-0 right-0 h-[calc(100%)]"
        initial={{ width: "880px" }}
        animate={{ width: size === "small" ? "0px" : "880px" }}
        transition={{
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="relative h-full w-full p-4">
          <WavyTab size={size} onClick={toggleSize} />
          <AnimatePresence mode="wait">
            {showingSelectedTraitDetails && <TraitDetailsSlider />}
          </AnimatePresence>
          <TabGroup as={Fragment}>
            <motion.div
              className="flex flex-col h-full"
              animate={{
                opacity: showingSelectedTraitDetails ? 0.5 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
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
                <AnimatePresence>
                  {size === "large" && (
                    <motion.div
                      className="flex-1 flex flex-col h-full"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={contentVariants}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </TabGroup>
        </div>
      </motion.div>
    </>
  );
};

export default NomBuilderTraitPalette;
