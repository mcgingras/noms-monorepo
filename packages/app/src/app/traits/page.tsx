"use client";

import { useState, useEffect } from "react";
import TraitTab from "./components/TraitTab";
import SoftArrow from "@/components/icons/SoftArrow";
import AnimatedTabsVertical from "@/components/AnimatedTabsVertical";
import Searchbar from "@/components/Searchbar";
import TraitGridUI from "./components/TraitGridUI";
import TraitDetails from "./components/TraitDetails";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getTraits } from "@/actions/getTraits";

const TraitsPage = ({ searchParams }: { searchParams: any }) => {
  const { data } = useSuspenseQuery({
    queryKey: ["traits-query", searchParams.type || "all"],
    queryFn: async () => {
      const traits = await getTraits(searchParams.type || "all", "");
      return { traits };
    },
  });

  const { traits } = data;
  const [selectedTrait, setSelectedTrait] = useState(traits[0]);

  useEffect(() => {
    setSelectedTrait(traits[0]);
  }, [traits]);

  return (
    <main className="h-[calc(100vh-66px)] w-full flex flex-col">
      <section className="flex-grow flex flex-col overflow-hidden">
        <div className="pt-12 pb-4 flex flex-row">
          <TraitTab />
        </div>
        <div className="flex-grow flex flex-row space-x-2 overflow-hidden">
          <AnimatedTabsVertical />
          <div className="flex-1 flex flex-col space-y-2 overflow-hidden">
            <div className="flex flex-row justify-between items-center">
              <Searchbar />
              <div className="flex flex-row items-center space-x-2">
                <p className="pangram-sans">Page 1 of 9</p>
                <span className="bg-gray-900 h-6 w-6 rounded-full block"></span>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto">
              <TraitGridUI
                traits={traits}
                setSelectedTrait={setSelectedTrait}
                selectedTrait={selectedTrait}
              />
            </div>
          </div>
          <div className="w-[375px] bg-gray-900 rounded-lg">
            {selectedTrait && <TraitDetails selectedTrait={selectedTrait} />}
          </div>
        </div>
      </section>
    </main>
  );
};

export default TraitsPage;
