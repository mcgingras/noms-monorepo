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
import { createSingleNom } from "@/lib/viem/createNom";

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
  const [pendingParts, setPendingParts] = useState<any[]>([]);
  const [page, setPage] = useState<"builder" | "cart">("builder");
  const addPart = (part: any) => {
    setPendingParts([...pendingParts, part]);
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
              <Cart pendingParts={pendingParts} />
            </nav>
            <div className="flex flex-row gap-4 h-full">
              <div className="flex-1 flex flex-col gap-y-2">
                <ItemAccordion title="Purchasing" number={pendingParts.length}>
                  <div className="flex flex-row gap-x-4 mt-4">
                    {pendingParts.map((part) => (
                      <div
                        key={part.id}
                        className="flex flex-row items-center gap-x-2"
                      >
                        <span className="h-20 w-20 self-start mt-[2px]">
                          <img
                            src={`data:image/svg+xml;base64,${part.svg}`}
                            alt={part.name}
                            className="w-full h-full rounded"
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </ItemAccordion>
                <ItemAccordion
                  title="Changing"
                  number={pendingParts.length}
                  description="Any un-equipped items go into a nom's closet."
                >
                  <p></p>
                </ItemAccordion>
              </div>
              <div className="min-w-[500px] flex flex-col h-full">
                <div className="flex flex-col space-y-2 flex-1">
                  <div className="flex flex-row items-center gap-x-2">
                    <span className="pangram-sans font-bold">
                      Purchasing {pendingParts.length} items
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
                    // 2. init TBA (depends on tokenId of 1)
                    // 3. mint all parts to TBA address
                    // 4. equip all parts

                    const results = await createSingleNom({ account: address });
                    console.log("results", results);
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
              <LayerStack parts={pendingParts} setParts={setPendingParts} />
            </div>
            <div className="flex-1 bg-[#151515] rounded-[24px] flex flex-row">
              <NomViewer pendingParts={pendingParts} />
              <div className="relative p-4 w-[700px] h-full overflow-hidden">
                <WavyTab />
                <TabGroup className="flex flex-col h-full">
                  <Nav>
                    <AnimatedTabs />
                    <Cart
                      pendingParts={pendingParts}
                      onClick={() => {
                        setPage("cart");
                      }}
                    />
                  </Nav>
                  <TabPanels as={Fragment}>
                    <TabPanel as={Fragment} unmount={true}>
                      <AnimatePresence mode="wait">
                        <ClosetTab pendingParts={pendingParts} />
                      </AnimatePresence>
                    </TabPanel>
                    <TabPanel as={Fragment} unmount={true}>
                      <AnimatePresence mode="wait">
                        <MallTab onPartClick={addPart} />
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
