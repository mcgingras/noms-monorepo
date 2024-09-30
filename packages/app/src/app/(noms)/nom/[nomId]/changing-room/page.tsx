"use client";

import { Fragment, useState, useEffect } from "react";
import AnimatedTabs from "@/components/AnimatedTabs";
import AnimatedTabsVertical from "@/components/AnimatedTabsVertical";
import ChangingRoomRow from "../../components/ChangingRoomRow";
import LayerStack from "../../components/LayerStack";
import WavyTab from "../../components/WavyTab";
import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import getNomById from "@/actions/getNomById";
import ClosetList from "./components/ClosetList";
import Image from "next/image";
import TraitViewer from "@/components/TraitViewer";

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
  const [page, setPage] = useState<"builder" | "cart">("builder");
  const nomId = params.nomId;
  const { data } = useQuery({
    queryKey: ["nom", nomId],
    queryFn: () => getNomById(Number(nomId)),
  });

  const [parts, setParts] = useState<any[]>([]);
  const [pendingParts, setPendingParts] = useState<any[]>([]);
  const traits = data?.traits.items.map((trait: any) => trait.trait) || [];
  const selectedTraitId = searchParams.trait;

  useEffect(() => {
    if (data) {
      setParts([...traits, ...parts]);
    }
  }, [data]);

  return (
    <main className="h-[calc(100vh-66px)] w-full">
      <section className="pt-12 flex flex-row space-x-2 h-full w-full">
        <div className="w-[288px]">
          <LayerStack parts={parts} setParts={setParts} />
        </div>
        <div className="flex-1 bg-[#151515] rounded-[24px] flex flex-row">
          <div className="p-1 h-full flex-1">
            <div
              className="h-full w-full rounded-[20px] p-4 flex flex-col"
              style={{
                backgroundColor: "#222222",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='0.08' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
              }}
            >
              <h3 className="oziksoft text-xl">Nom 1</h3>
              <span className="text-sm text-[#818080] pangram-sans font-semibold">
                Not yet finalized
              </span>
              <div className="relative p-4 flex-1 flex items-center justify-center">
                <div className="relative w-1/2 aspect-square bg-gray-900">
                  {data && (
                    <Image
                      src={`data:image/svg+xml;base64,${data.fullSVG}`}
                      alt="Rendered nom"
                      className="object-contain"
                      fill
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="relative p-4 w-[700px] h-full overflow-hidden">
            <WavyTab />
            <TabGroup className="flex flex-col h-full">
              <div className="flex flex-row justify-between w-full">
                <AnimatedTabs />
                <Cart
                  pendingParts={pendingParts}
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
                      <AnimatedTabsVertical />
                      <div className="flex-1 flex flex-col">
                        <input
                          type="text"
                          className="bg-gray-900 w-[200px] h-6 block rounded"
                        />
                        {pendingParts.length > 0 && (
                          <div className="w-full bg-gray-900 p-2 rounded-lg mt-2">
                            <h3 className="pangram-sans-compact font-bold">
                              Changing room
                            </h3>
                            <div className="mt-2 flex flex-row flex-wrap gap-2">
                              {pendingParts.map((part) => (
                                <div
                                  key={part.id}
                                  className="min-w-20 w-1/8 aspect-square rounded-lg bg-gray-800"
                                ></div>
                              ))}
                            </div>
                          </div>
                        )}
                        <hr className="mt-2 border-gray-900" />
                        <div className="pt-2 flex-1">
                          <h3 className="pangram-sans-compact font-bold">
                            Closet
                          </h3>
                          <ClosetList traits={traits} />
                        </div>
                        {selectedTraitId && (
                          <TraitViewer traitId={selectedTraitId} />
                        )}
                      </div>
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
                      <div className="flex-1 flex flex-col">
                        <input
                          type="text"
                          className="bg-gray-900 w-[200px] h-6 block rounded"
                        />
                        <div className="w-full bg-gray-900 p-2 rounded-lg mt-2">
                          <h3 className="pangram-sans-compact font-bold">
                            Changing room
                          </h3>
                          <div className="mt-2 flex flex-row flex-wrap gap-2">
                            <div className="min-w-20 w-1/8 aspect-square rounded-lg bg-gray-800"></div>
                            <div className="min-w-20 w-1/8 aspect-square rounded-lg bg-gray-800"></div>
                            <div className="min-w-20 w-1/8 aspect-square rounded-lg bg-gray-800"></div>
                          </div>
                        </div>
                        <hr className="mt-2 border-gray-900" />
                        <div className="pt-2">
                          <h3 className="pangram-sans-compact font-bold">
                            Closet
                          </h3>
                          <ChangingRoomRow />
                          <ChangingRoomRow />
                          <ChangingRoomRow />
                        </div>
                        <div className="bg-gray-900 mt-2 rounded-lg p-2 flex-1">
                          <h3 className="pangram-sans font-bold">
                            Glasses blue green square
                          </h3>
                        </div>
                      </div>
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
