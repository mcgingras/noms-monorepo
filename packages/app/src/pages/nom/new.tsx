import PrimaryLayout from "@/layouts/PrimaryLayout";
import { ConnectKitButton } from "connectkit";
import NomViewer from "@/components/NomViewer";
import TraitSelector from "@/components/TraitSelector";

const NewNomPage = () => {
  return (
    <PrimaryLayout>
      <div className="h-full">
        <nav className="flex flex-row justify-between mb-6">
          <span></span>
          <ConnectKitButton />
        </nav>
        <section className="grid grid-cols-3 gap-6 h-[calc(100vh-30%)]">
          <TraitSelector />
          <NomViewer id={1} />
        </section>
        <button className="bg-blue-500 border-4 border-blue-400 rounded-full px-6 py-2 text-white font-bold fixed bottom-8 left-[calc(50%-50px)]">
          Buy
        </button>
      </div>
    </PrimaryLayout>
  );
};

export default NewNomPage;
