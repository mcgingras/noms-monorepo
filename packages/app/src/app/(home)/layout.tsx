"use client";

import { useState } from "react";
import NomList from "./components/NomList";
import NomTab from "./components/NomTab";
import { useNoms } from "@/actions/useNoms";
import Pagination from "@/components/Pagination";

const NomViewLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [page, setPage] = useState(0);
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    fetchPreviousPage,
    hasPreviousPage,
  } = useNoms();

  return (
    <main className="h-[calc(100vh-66px)] w-full">
      <section className="pt-12 flex flex-row space-x-2 h-full w-full">
        <div className="flex-[0_1_460px] min-w-0 only:flex-grow">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-2">
              <NomTab />
              <span className="pangram-sans font-bold text-sm bg-[#262626] px-2 py-1 rounded-xl self-end">
                {data.count} Nom{data.count > 1 ? "s" : ""}
              </span>
            </div>
            <Pagination
              count={data.count}
              currentPage={page}
              totalPages={data.totalPages}
              hasPreviousPage={hasPreviousPage}
              hasNextPage={hasNextPage}
              handlePrevious={fetchPreviousPage}
              handleNext={fetchNextPage}
              setPage={setPage}
            />
          </div>
          <div className="mt-4 flex flex-row gap-2 flex-wrap">
            <NomList noms={data.noms} />
          </div>
        </div>
        {children}
      </section>
    </main>
  );
};

export default NomViewLayout;
