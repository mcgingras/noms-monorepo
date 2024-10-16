"use client";

import { useState, useEffect } from "react";
import TraitTab from "./components/TraitTab";
import AnimatedTabsVertical from "./components/AnimatedTabsVertical";
import Searchbar from "@/components/Searchbar";
import TraitGridUI from "./components/TraitGridUI";
import TraitDetails from "./components/TraitDetails";
import { useTraitsPaginated } from "@/actions/useTraitsPaginated";
import ArrowLeftIcon from "@/components/icons/ArrowLeftIcon";
import ArrowRightIcon from "@/components/icons/ArrowRIghtIcon";
import { Trait } from "@/types/trait";

const TraitsPage = ({ searchParams }: { searchParams: any }) => {
  const [page, setPage] = useState(0);
  const type = searchParams.type || "all";
  const searchQuery = searchParams.searchQuery || "";
  const creator = searchParams.creator || "";
  const {
    data,
    isLoading,
    handleNext,
    handlePrevious,
    hasNextPage,
    hasPreviousPage,
  } = useTraitsPaginated({
    typeFilter: type,
    searchQuery: searchQuery,
    creator: creator,
  });

  const [selectedTrait, setSelectedTrait] = useState<Trait | null>(null);

  useEffect(() => {
    setSelectedTrait(data?.traits?.items?.[0]);
  }, [data.traits]);

  return (
    <main className="h-[calc(100vh-66px)] w-full flex flex-col">
      <section className="flex-grow flex flex-col overflow-hidden">
        <div className="pt-12 pb-4 flex flex-row space-x-2">
          <TraitTab />
          <span className="pangram-sans font-bold text-sm bg-[#262626] px-2 py-1 rounded-xl self-end">
            {data.count} traits
          </span>
        </div>
        <div className="flex-grow flex flex-row space-x-2 overflow-hidden">
          <AnimatedTabsVertical />
          <div className="flex-1 flex flex-col space-y-2 overflow-hidden">
            <div className="flex flex-row justify-between items-center">
              <Searchbar />
              <div className="flex flex-row items-center space-x-2">
                <div className="pangram-sans text-sm font-semibold">
                  page {page + 1} of {data.totalPages}
                </div>

                <button
                  onClick={() => {
                    if (hasPreviousPage) {
                      handlePrevious();
                      setPage(page - 1);
                    }
                  }}
                  className={`${hasPreviousPage ? "bg-gray-900" : "bg-gray-1000"} rounded-full p-2 transition-all`}
                >
                  <ArrowLeftIcon
                    className={`w-4 h-4 ${hasPreviousPage ? "opacity-100" : "opacity-30"} transition-all`}
                  />
                </button>

                <button
                  onClick={() => {
                    if (hasNextPage) {
                      handleNext();
                      setPage(page + 1);
                    }
                  }}
                  className={`${hasNextPage ? "bg-gray-900" : "bg-gray-1000"} rounded-full p-2 transition-all`}
                >
                  <ArrowRightIcon
                    className={`w-4 h-4 ${hasNextPage ? "opacity-100" : "opacity-30"} transition-all`}
                  />
                </button>
              </div>
            </div>
            <div className="flex-grow grid grid-cols-[1fr,auto] gap-2 overflow-hidden">
              <div className="overflow-y-auto">
                <TraitGridUI
                  traits={data?.traits?.items ?? []}
                  setSelectedTrait={setSelectedTrait}
                  selectedTrait={selectedTrait}
                />
              </div>
              <div className="w-[375px] bg-gray-900 rounded-lg overflow-y-auto">
                {selectedTrait && (
                  <TraitDetails selectedTrait={selectedTrait} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TraitsPage;
