"use client";

import { useState } from "react";
import TraitTab from "./components/TraitTab";
import AnimatedTabsVertical from "./components/AnimatedTabsVertical";
import Searchbar from "@/components/Searchbar";
import TraitGridUI from "./components/TraitGridUI";
import TraitDetails from "./components/TraitDetails";
import { useTraitsPaginated } from "@/actions/useTraitsPaginated";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "@/components/Pagination";

const TraitsPage = ({ searchParams }: { searchParams: any }) => {
  const [page, setPage] = useState(0);
  const type = searchParams.type || "all";
  const searchQuery = searchParams.searchQuery || "";
  const creator = searchParams.creator || "";
  const selectedTraitId = searchParams.traitId || "";
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
              <Pagination
                count={data.count}
                currentPage={page}
                totalPages={data.totalPages}
                hasPreviousPage={hasPreviousPage}
                hasNextPage={hasNextPage}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                setPage={setPage}
              />
            </div>
            <div className="flex-grow grid grid-cols-[1fr,auto] overflow-hidden">
              <div className="overflow-y-auto">
                <TraitGridUI
                  traits={data?.traits?.items ?? []}
                  selectedTraitId={selectedTraitId}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
          <AnimatePresence>
            {selectedTraitId && (
              <motion.div
                className="w-[500px] bg-gray-900 rounded-lg overflow-y-auto"
                initial={{ x: 500 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              >
                <TraitDetails selectedTraitId={selectedTraitId} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
};

export default TraitsPage;
