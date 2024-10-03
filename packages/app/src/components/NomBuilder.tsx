"use client";

import { useState, useEffect } from "react";
import LayerStack from "./LayerStack";
import { Layer } from "../types/layer";
import NomBuilderCanvas from "./NomBuilderCanvas";
import NomPreview from "./NomPreview";
import WavyTab from "./WavyTab";
import NomBuilderTraitPalette from "./NomBuilderTraitPalette";
import { Trait } from "@/types/trait";
import { LayerChangeType } from "@/types/layer";
import { useQuery } from "@tanstack/react-query";
import getNomById from "@/actions/getNomById";
import { NomTrait } from "@/types/trait";

const NomBuilder = ({
  selectedTraitId,
  nomId,
}: {
  selectedTraitId: string;
  nomId: string | null;
}) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [ownedTraits, setOwnedTraits] = useState<Trait[]>([]);
  const [pendingTraits, setPendingTraits] = useState<Trait[]>([]);
  const [size, setSize] = useState<"small" | "large">("large");

  const toggleSize = () => {
    setSize(size === "small" ? "large" : "small");
  };

  const { data: nomSnapshot } = useQuery({
    queryKey: ["nom", nomId],
    queryFn: () => getNomById(Number(nomId)),
  });
  const existingNomTraits = nomSnapshot?.traits || [];

  useEffect(() => {
    if (nomSnapshot) {
      const layers = existingNomTraits.map((nomTrait: NomTrait) => ({
        owned: true,
        trait: nomTrait.trait,
        equipped: nomTrait.equipped,
        type: LayerChangeType.FIXED,
      })) as Layer[];

      setLayers([...layers]);
    }
  }, [nomSnapshot]);

  const addTraitToLayersFromShop = (trait: Trait) => {
    const newLayer = {
      trait,
      owned: false,
      equipped: true,
      type: LayerChangeType.BUY_AND_EQUIP,
    };
    setLayers([...layers, newLayer]);
  };

  return (
    <main className="h-[calc(100vh-66px)] w-full">
      <section className="pt-12 flex flex-row space-x-2 h-full w-full">
        <LayerStack layers={layers} setLayers={setLayers} initialLayers={[]} />
        <NomBuilderCanvas>
          <NomPreview layers={layers} />
          <WavyTab size={size} onClick={toggleSize} />
          <NomBuilderTraitPalette
            size={size}
            pendingTraits={pendingTraits}
            setPendingTraits={setPendingTraits}
            addTraitToLayersFromShop={addTraitToLayersFromShop}
            ownedTraits={ownedTraits}
            selectedTraitId={selectedTraitId}
          />
        </NomBuilderCanvas>
      </section>
    </main>
  );
};

export default NomBuilder;
