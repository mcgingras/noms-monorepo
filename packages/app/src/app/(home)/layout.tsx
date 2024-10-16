"use client";

import NomList from "./components/NomList";
import { useNoms } from "@/actions/useNoms";
import ArrowLeftIcon from "@/components/icons/ArrowLeftIcon";
import ArrowRightIcon from "@/components/icons/ArrowRIghtIcon";

const NomViewLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
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
        <div className="flex-[0_1_288px] min-w-0 only:flex-grow">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-2">
              <h2 className="oziksoft text-2xl">All Noms</h2>
              <span className="pangram-sans font-bold text-sm bg-[#262626] px-2 py-1 rounded-xl">
                {data.count} Nom{data.count > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <div className="pangram-sans text-sm">
                page 1 of {data.totalPages}
              </div>
              {hasPreviousPage && (
                <button
                  onClick={() => fetchPreviousPage()}
                  className="bg-gray-900 rounded-full p-2"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                </button>
              )}
              {hasNextPage && (
                <button
                  onClick={() => fetchNextPage()}
                  className="bg-gray-900 rounded-full p-2"
                >
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              )}
            </div>
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
