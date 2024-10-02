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
import RenderingNom from "@/components/RenderingNom";
import { Layer, LayerChangeType } from "@/types/layer";
import { Trait, NomTrait } from "@/types/trait";

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
        <div className="w-[288px]">
          <LayerStack
            layers={layers}
            initialLayers={existingNomTraits}
            setLayers={setLayers}
          />
        </div>
        <div className="flex-1 bg-[#151515] rounded-[24px] flex flex-row relative">
          <div className="p-1 h-full flex-1">
            <div
              className="h-full w-full rounded-[20px] p-4 flex flex-col"
              style={{
                backgroundColor: "#222222",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='4' cy='4' r='2' fill='%23ffffff' fill-opacity='0.08' /%3E%3Ccircle cx='16' cy='16' r='2' fill='%23ffffff' fill-opacity='0.08' /%3E%3C/svg%3E")`,
                backgroundSize: "20px 20px",
              }}
            >
              <h3 className="oziksoft text-xl">Nom 1</h3>
              <span className="text-sm text-[#818080] pangram-sans font-semibold">
                Not yet finalized
              </span>
              <div className="relative p-4 flex-1 flex items-center justify-center overflow-hidden">
                <div className="relative w-2/3 aspect-square bg-gray-1000">
                  <RenderingNom layers={layers} />
                </div>
              </div>
            </div>
          </div>
          <WavyTab
            size={size}
            onClick={() => {
              setSize(size === "small" ? "large" : "small");
            }}
          />
          <div
            className={`relative p-4 h-full overflow-hidden ${
              size === "small" ? "w-0" : "w-[840px]"
            }`}
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
              <AnimatePresence mode="wait">
                <TabPanels as={Fragment}>
                  <TabPanel as={Fragment} unmount={true}>
                    <motion.div
                      key={"tab-1"}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 h-full flex flex-row space-x-2 w-full"
                    >
                      <ClosetTab
                        pendingTraits={pendingTraits}
                        existingNomTraits={existingNomTraits}
                        selectedTraitId={selectedTraitId}
                      />
                    </motion.div>
                  </TabPanel>
                  <TabPanel as={Fragment} unmount={true}>
                    <motion.div
                      key={"tab-2"}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 h-full flex flex-row space-x-2 w-full"
                    >
                      <MallTab
                        onPartClick={(part: Trait) => {
                          setPendingTraits([part, ...pendingTraits]);
                          addTraitToLayersFromShop(part);
                          addSearchParam("trait", part.id.toString());
                        }}
                      />
                    </motion.div>
                  </TabPanel>
                </TabPanels>
              </AnimatePresence>
            </TabGroup>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChangingRoom;
