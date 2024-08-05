import NomCard from "./components/NomCard";

const NomViewLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="h-[calc(100vh-34px)]">
      <section className="pt-12 px-4 flex flex-row space-x-4 h-full">
        <div>
          <div className="flex flex-row items-center space-x-2">
            <h2 className="oziksoft text-2xl">All Noms</h2>
            <span className="pangram-sans font-bold text-sm bg-[#262626] px-2 py-1 rounded-xl">
              164 Noms
            </span>
          </div>
          <div className="mt-4 flex flex-row space-x-4">
            <NomCard />
            <NomCard nomId={1} />
          </div>
        </div>
        {children}
      </section>
    </main>
  );
};

export default NomViewLayout;
