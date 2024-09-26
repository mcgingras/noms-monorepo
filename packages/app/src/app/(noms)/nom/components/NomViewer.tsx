import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { easelAbi } from "../../../../../../ponder/foundry/abis";
import { CHAIN_ID, EASEL_ADDRESS } from "@/lib/constants";

const NomViewer = ({ pendingParts }: { pendingParts: any[] }) => {
  const [nomSVG, setNomSVG] = useState<string | null>(null);

  const { data, isLoading } = useReadContract({
    chainId: CHAIN_ID,
    abi: easelAbi,
    address: EASEL_ADDRESS,
    functionName: "generateSVGForParts",
    args: [pendingParts.map((part) => part.rleBytes) as any],
  });

  useEffect(() => {
    if (data) {
      setNomSVG(data);
    }
  }, [data]);

  return (
    <div className="p-1 h-full flex-1">
      <div
        className="h-full w-full rounded-[20px] p-4 flex-col flex"
        style={{
          backgroundColor: "#222222",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='0.08' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      >
        <h3 className="oziksoft text-xl">New Nom</h3>
        <span className="text-sm text-[#818080] pangram-sans font-semibold">
          Not yet finalized
        </span>
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="w-3/4 aspect-square bg-gray-800 min-w-[320px] mt-[-50px] relative">
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
        </div>
      </div>
    </div>
  );
};

export default NomViewer;
