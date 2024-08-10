"use client";

import Editor from "./components/Editor";
import DOMEditor from "./components/DOMEditor";
import Toolbox from "./components/Toolbox";
import { usePixelGrid } from "./hooks/usePixelGrid";

const colors = [
  "#1929F4",
  "#AB36BE",
  "#F4C724",
  "#F4A724",
  "#F42424",
  "#24F424",
  "#24F4F4",
  "#2424F4",
  "#F424F4",
];

const NewTraitPage = () => {
  const editorMethods = usePixelGrid(32, 32);

  return (
    <main className="h-[calc(100vh-66px)] w-full">
      <section className="pt-12 flex flex-row space-x-2 h-full w-full">
        <div className="w-[288px]"></div>
        <div className="bg-[#151515] h-full w-full flex flex-row p-1 rounded-[24px]">
          <div className="bg-gray-900 h-full flex-1 rounded-[20px] flex flex-col p-4 overflow-hidden">
            <div className="flex flex-1">
              {/* <Editor /> */}
              <DOMEditor {...editorMethods} />
            </div>
            <div className="w-full h-[60px] bg-gray-800 rounded-lg flex items-center px-2">
              <div className="flex flex-row space-x-2">
                {colors.map((color) => (
                  <div
                    onClick={() => {
                      editorMethods.setColor(color);
                    }}
                    key={color}
                    className="w-[50px] h-[50px] rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            </div>
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
