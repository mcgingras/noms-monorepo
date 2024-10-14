"use client";

import DOMEditor from "./components/DOMEditor";
import Toolbox from "./components/Toolbox";
import { usePixelGrid } from "./hooks/usePixelGrid";
import ColorSelector from "./components/ColorSelector";
import NomAndLayerStack from "./components/NomAndLayerStack";
import { TraitEditorProvider } from "@/stores/traitEditor/context";
import { useQuery } from "@tanstack/react-query";
import getNomsByOwner from "@/actions/getNomsByOwner";
import { useAccount } from "wagmi";
import { Nom } from "@/types/nom";

const NewTraitPage = () => {
  const editorMethods = usePixelGrid(32, 32);
  const { address } = useAccount();

  const { data: noms, status } = useQuery({
    queryKey: ["noms", address],
    queryFn: () => getNomsByOwner(address!),
    enabled: !!address,
  });

  if (status === "pending") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-66px)] w-full">
        <p className="pangram-sans">Loading trait editor...</p>
      </div>
    );
  }

  if (status === "error") {
    return <div>Error fetching noms for trait editor</div>;
  }

  //   because of the checks above, we can be sure that if nomId is null, it is because we actually have no noms to show
  return (
    <TraitEditorProvider nomId={noms?.items[0]?.tokenId || null}>
      <main className="h-[calc(100vh-66px)] w-full">
        <section className="pt-12 flex flex-row space-x-2 h-full w-full">
          <NomAndLayerStack noms={noms?.items || []} />
          <div className="bg-[#151515] h-full w-full flex flex-row p-1 rounded-[24px]">
            <div className="bg-gray-900 h-full flex-1 rounded-[20px] flex flex-col p-4 overflow-hidden relative">
              <div className="flex flex-1">
                <DOMEditor {...editorMethods} />
              </div>
              {/* block to save space for color selector */}
              <div className="h-[60px]" />
              <ColorSelector {...editorMethods} />
            </div>
            <div className="w-[220px]">
              <Toolbox {...editorMethods} />
            </div>
          </div>
        </section>
      </main>
    </TraitEditorProvider>
  );
};

export default NewTraitPage;
