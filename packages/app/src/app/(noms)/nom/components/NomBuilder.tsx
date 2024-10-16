"use client";

import { useState } from "react";
import LayerStack from "./LayerStack";
import NomBuilderCanvas from "./NomBuilderCanvas";
import NomPreview from "../../../../components/NomPreview";
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
          <NomPreview size={size} />
          <NomBuilderTraitPalette size={size} toggleSize={toggleSize} />
        </NomBuilderCanvas>
      </section>
    </main>
  );
};

export default NomBuilder;
