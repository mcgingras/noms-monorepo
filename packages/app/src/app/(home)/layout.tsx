import NomList from "./components/NomList";
import { Suspense } from "react";

const NomViewLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const noms = [];
  return (
    <main className="h-[calc(100vh-66px)] w-full">
      <section className="pt-12 flex flex-row space-x-2 h-full w-full">
        <div className="flex-[0_1_288px] min-w-0 only:flex-grow">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-2">
              <h2 className="oziksoft text-2xl">All Noms</h2>
              <span className="pangram-sans font-bold text-sm bg-[#262626] px-2 py-1 rounded-xl">
                {noms.length} Noms
              </span>
            </div>
            <div className="pangram-sans text-sm">page 1 of 6</div>
          </div>

          <div className="mt-4 flex flex-row gap-2 flex-wrap">
            {/* <NomCard /> */}
            <Suspense fallback={<div>Loading...</div>}>
              <NomList />
            </Suspense>
          </div>
        </div>
        {children}
      </section>
    </main>
  );
};

export default NomViewLayout;
