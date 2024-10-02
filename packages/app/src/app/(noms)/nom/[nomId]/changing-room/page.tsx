"use client";

import { Fragment, useState, useEffect } from "react";
import AnimatedTabs from "@/components/AnimatedTabs";
import LayerStack from "../../components/LayerStack";
import WavyTab from "../../components/WavyTab";
import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import getNomById from "@/actions/getNomById";
import MallTab from "./components/MallTab";
import ClosetTab from "./components/ClosetTab";
import { useAddSearchParam } from "@/hooks/useAddSearchParam";
import { Layer, LayerChangeType } from "@/types/layer";
import { Trait, NomTrait } from "@/types/trait";
import NomViewer from "@/app/(noms)/nom/components/NomViewer";
import AnimatedTabsVertical from "@/components/AnimatedTabsVertical";
import SearchInput from "@/components/SearchInput";

const Cart = ({
  pendingParts,
  onClick,
}: {
  pendingParts: any[];
  onClick?: () => void;
}) => {
  return (
    <span
      className="oziksoft text-2xl cursor-pointer gap-x-2 flex flex-row items-center justify-center"
      onClick={onClick}
    >
      <span>Cart</span>
      <span className="bg-blue-500 h-6 w-6 flex items-center justify-center rounded-full">
        {pendingParts.length}
      </span>
    </span>
  );
};

const ChangingRoom = ({
  params,
  searchParams,
}: {
  params: { nomId: string };
  searchParams: { trait: string };
}) => {
  const addSearchParam = useAddSearchParam();
  const [size, setSize] = useState<"small" | "large">("large");
  const [page, setPage] = useState<"builder" | "cart">("builder");
  const nomId = params.nomId;
  const { data: nomSnapshot } = useQuery({
    queryKey: ["nom", nomId],
    queryFn: () => getNomById(Number(nomId)),
  });

  const [pendingTraits, setPendingTraits] = useState<Trait[]>([]);
  const [layers, setLayers] = useState<Layer[]>([]);
  const existingNomTraits = nomSnapshot?.traits || [];
  const selectedTraitId = searchParams.trait;

  useEffect(() => {
    if (nomSnapshot) {
      const layers = existingNomTraits.map((nomTrait: NomTrait) => ({
        owned: true,
        trait: nomTrait.trait,
        equipped: nomTrait.equipped,
        type: LayerChangeType.FIXED,
      })) as Layer[];

      setLayers([...layers]);
    }
  }, [nomSnapshot]);

  const addTraitToLayersFromShop = (trait: Trait) => {
    const newLayer = {
      trait,
      owned: false,
      equipped: true,
      type: LayerChangeType.BUY_AND_EQUIP,
    };
    setLayers([...layers, newLayer]);
  };

  return (
    <main className="h-[calc(100vh-66px)] w-full">
      <section className="pt-12 flex flex-row space-x-2 h-full w-full">
        <div className="w-[288px] h-full">
          <LayerStack
            layers={layers}
            initialLayers={existingNomTraits}
            setLayers={setLayers}
          />
        </div>
        <div className="flex-1 bg-[#151515] rounded-[24px] flex flex-row relative h-full">
          <NomViewer layers={layers} />
          <WavyTab
            size={size}
            onClick={() => {
              setSize(size === "small" ? "large" : "small");
            }}
          />
          <motion.div
            className="relative p-4 h-full overflow-hidden"
            initial={{ width: "840px" }}
            animate={{ width: size === "small" ? 0 : "840px" }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1], // Custom bezier curve
            }}
          >
            <TabGroup className="flex flex-col h-full">
              <div className="flex flex-row justify-between w-full">
                <AnimatedTabs />
                <Cart
                  pendingParts={pendingTraits}
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
                        <ClosetTab
                          key={"tab-1"}
                          pendingTraits={pendingTraits}
                          existingNomTraits={existingNomTraits}
                          selectedTraitId={selectedTraitId}
                        />
                      </TabPanel>
                      <TabPanel as={Fragment} unmount={true}>
                        <MallTab
                          key={"tab-2"}
                          onPartClick={(part: Trait) => {
                            setPendingTraits([part, ...pendingTraits]);
                            addTraitToLayersFromShop(part);
                            addSearchParam("trait", part.id.toString());
                          }}
                        />
                      </TabPanel>
                    </TabPanels>
                  </AnimatePresence>
                </div>
              </div>
            </TabGroup>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default ChangingRoom;
