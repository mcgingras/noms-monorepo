import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { easelAbi } from "../../../ponder/foundry/abis";
import { CHAIN_ID, EASEL_ADDRESS } from "@/lib/constants";
import { Layer } from "@/types/layer";

const RenderingNom = ({ layers }: { layers: Layer[] }) => {
  const [nomSVG, setNomSVG] = useState<string | null>(null);
  // The Nouns rendering engine draws first layer, the second etc
  // So we need to reverse the layers to make it feel more like expected
  const orderedLayers = [...layers].reverse();

  const { data, isLoading, error } = useReadContract({
    chainId: CHAIN_ID,
    abi: easelAbi,
    address: EASEL_ADDRESS,
    functionName: "generateSVGForParts",
    args: [orderedLayers.map((layer) => layer.trait.rleBytes) as any],
    query: {
      enabled: !!orderedLayers && orderedLayers.length > 0,
    },
  });

  useEffect(() => {
    if (data) {
      setNomSVG(data);
    }
  }, [data]);

  return (
    <div className="w-full h-full relative">
      <div
        className={`w-full h-full absolute transition-colors ${
          isLoading ? "bg-black/30" : "bg-black/0"
        }`}
      />
      {nomSVG && (
        <img
          src={`data:image/svg+xml;base64,${btoa(nomSVG!)}`}
          className="w-full"
        />
      )}
    </div>
  );
};

export default RenderingNom;
