"use client";

import { useState } from "react";
import LayerStack from "./LayerStack";
import NomBuilderCanvas from "./NomBuilderCanvas";
import NomPreview from "../../../../components/NomPreview";
import WavyTab from "./WavyTab";
import NomBuilderTraitPalette from "./NomBuilderTraitPalette";

const NomBuilder = () => {
  const [size, setSize] = useState<"small" | "large">("large");

  const toggleSize = () => {
    setSize(size === "small" ? "large" : "small");
  };

  return (
    <main className="h-[calc(100vh-66px)] w-full">
      <section className="pt-12 flex flex-row space-x-2 h-full w-full">
        <LayerStack />
        <NomBuilderCanvas>
          <NomPreview />
          <WavyTab size={size} onClick={toggleSize} />
          <NomBuilderTraitPalette size={size} />
        </NomBuilderCanvas>
      </section>
    </main>
  );
};

export default NomBuilder;
