"use client";

import DOMEditor from "./components/DOMEditor";
import Toolbox from "./components/Toolbox";
import { usePixelGrid } from "./hooks/usePixelGrid";
import ColorSelector from "./components/ColorSelector";

const NewTraitPage = () => {
  const editorMethods = usePixelGrid(32, 32);

  return (
    <main className="h-[calc(100vh-66px)] w-full">
      <section className="pt-12 flex flex-row space-x-2 h-full w-full">
        <div className="w-[288px]"></div>
        <div className="bg-[#151515] h-full w-full flex flex-row p-1 rounded-[24px]">
          <div className="bg-gray-900 h-full flex-1 rounded-[20px] flex flex-col p-4 overflow-hidden">
            <div className="flex flex-1">
              <DOMEditor {...editorMethods} />
            </div>
            <ColorSelector {...editorMethods} />
          </div>
          <div className="w-[250px]">
            <Toolbox {...editorMethods} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default NewTraitPage;
