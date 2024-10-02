"use client";

import { useState, Fragment } from "react";
import { AnimatePresence } from "framer-motion";
import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";
import AnimatedTabs from "@/components/AnimatedTabs";
import LayerStack from "../components/LayerStack";
import WavyTab from "../components/WavyTab";
import MallTab from "../components/MallTab";
import ClosetTab from "../components/ClosetTab";
import NomViewer from "../components/NomViewer";
import ArrowLeftIcon from "@/components/icons/ArrowLeftIcon";
import CaratDownIcon from "@/components/icons/CaratDownIcon";
import CaratUpIcon from "@/components/icons/CaratUpIcon";
import { useAccount } from "wagmi";
import { initNom } from "@/lib/viem/createNom";
import { Layer, LayerChangeType } from "@/types/layer";
import { Trait } from "@/types/trait";
import RenderingNom from "@/components/RenderingNom";

const Nav = ({ children }: { children: React.ReactNode }) => {
  return <nav className="flex flex-row justify-between w-full">{children}</nav>;
};

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

const ItemAccordion = ({
  title,
  number,
  description,
  children,
}: {
  title: string;
  number: number;
  description?: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#222] p-2 rounded-2xl">
      <div
        className="flex flex-row justify-between items-center cursor-pointer"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div className="flex flex-row items-center gap-x-2">
          <span className="text-lg text-white pangram-sans font-bold">
            {title}
          </span>
          <span className="h-6 w-6 flex items-center justify-center rounded-full bg-[#333] text-white">
            {number}
          </span>
        </div>

        <button className="h-6 w-6 flex items-center justify-center rounded-full bg-[#333] text-white">
          {open ? <CaratUpIcon /> : <CaratDownIcon />}
        </button>
      </div>
      {description && (
        <p className="text-sm pangram-sans text-[#707070]">{description}</p>
      )}
      {open && children}
    </div>
  );
};

const NewNomPage = () => {
  const { address } = useAccount();
  const [pendingLayers, setPendingLayers] = useState<Layer[]>([]);
  const [page, setPage] = useState<"builder" | "cart">("builder");
  const addTraitToLayer = (trait: Trait) => {
    const layer: Layer = {
      trait,
      equipped: false,
      owned: false,
      type: LayerChangeType.BUY_AND_EQUIP,
    };
    setPendingLayers([...pendingLayers, layer]);
  };

  return (
    <main className="h-[calc(100vh-66px)] w-full">
      <section className="pt-12 flex flex-row space-x-2 h-full w-full">
        {page === "cart" ? (
          <div className="flex-1 bg-[#151515] rounded-[24px] flex flex-col p-4 gap-y-2 h-full">
            <nav className="flex flex-row justify-between w-full items-center">
              <div
                className="cursor-pointer flex flex-row gap-x-2 items-center"
                onClick={() => {
                  setPage("builder");
                }}
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="oziksoft text-2xl">Back to editing</span>
              </div>
              <Cart pendingParts={pendingLayers} />
            </nav>
            <div className="flex flex-row gap-4 h-full">
              <div className="flex-1 flex flex-col gap-y-2">
                <ItemAccordion title="Purchasing" number={pendingLayers.length}>
                  <div className="flex flex-row gap-x-4 mt-4">
                    {pendingLayers.map((layer) => (
                      <div
                        key={layer.trait.id}
                        className="flex flex-row items-center gap-x-2"
                      >
                        <span className="h-20 w-20 self-start mt-[2px]">
                          <img
                            src={`data:image/svg+xml;base64,${layer.trait.svg}`}
                            alt={layer.trait.name}
                            className="w-full h-full rounded"
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </ItemAccordion>
                <ItemAccordion
                  title="Changing"
                  number={pendingLayers.length}
                  description="Any un-equipped items go into a nom's closet."
                >
                  <p></p>
                </ItemAccordion>
              </div>
              <div className="min-w-[500px] flex flex-col h-full">
                <div className="flex flex-col space-y-2 flex-1">
                  <div className="flex flex-row items-center gap-x-2">
                    <span className="pangram-sans font-bold">
                      Purchasing {pendingLayers.length} items
                    </span>
                    <hr className="flex-1 border-b border-dotted border-[#595959]" />
                    <span className="pangram-sans font-bold">0.0 ETH</span>
                  </div>
                  <div className="flex flex-row items-center gap-x-2">
                    <span className="pangram-sans font-bold">
                      3 layer changes
                    </span>
                    <hr className="flex-1 border-b border-dotted border-[#595959]" />
                    <span className="pangram-sans font-bold">FREE</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-row items-center gap-x-2">
                    <span className="pangram-sans font-bold">Network fee</span>
                    <hr className="flex-1 border-b border-dotted border-[#595959]" />
                    <span className="pangram-sans font-bold">0.0 ETH</span>
                  </div>
                  <div className="flex flex-row items-center gap-x-2">
                    <span className="pangram-sans font-bold">Total</span>
                    <hr className="flex-1 border-b border-dotted border-[#595959]" />
                    <span className="pangram-sans font-bold">FREE</span>
                  </div>
                </div>
                <button
                  className="bg-[#2B83F6] w-full rounded-lg flex justify-between items-center px-2 py-2 mt-2"
                  onClick={async () => {
                    if (!address) {
                      return;
                    }

                    // TODO: remove this
                    const isFirstNom = true;
                    if (isFirstNom) {
                      const tx = await initNom({
                        to: address,
                        traitTokenIds: pendingLayers.map((layer) =>
                          BigInt(layer.trait.id)
                        ),
                        quantities: pendingLayers.map(() => BigInt(1)),
                        prices: pendingLayers.map(() => BigInt(0)),
                      });
                    }
                  }}
                >
                  <span className="pangram-sans font-bold">
                    Mint and save changes
                  </span>
                  <span className="pangram-sans-compact font-bold text-sm bg-black/30 px-2 py-1 rounded">
                    0 ETH
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="w-[288px]">
              <LayerStack
                layers={pendingLayers}
                initialLayers={[]}
                setLayers={setPendingLayers}
              />
            </div>
            <div className="flex-1 bg-[#151515] rounded-[24px] flex flex-row">
              <NomViewer layers={pendingLayers} />
              <div className="relative p-4 w-[700px] h-full overflow-hidden">
                <WavyTab />
                <TabGroup className="flex flex-col h-full">
                  <Nav>
                    <AnimatedTabs />
                    <Cart
                      pendingParts={pendingLayers}
                      onClick={() => {
                        setPage("cart");
                      }}
                    />
                  </Nav>
                  <TabPanels as={Fragment}>
                    <TabPanel as={Fragment} unmount={true}>
                      <AnimatePresence mode="wait">
                        <ClosetTab pendingLayers={pendingLayers} />
                      </AnimatePresence>
                    </TabPanel>
                    <TabPanel as={Fragment} unmount={true}>
                      <AnimatePresence mode="wait">
                        <MallTab onPartClick={addTraitToLayer} />
                      </AnimatePresence>
                    </TabPanel>
                  </TabPanels>
                </TabGroup>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default NewNomPage;
