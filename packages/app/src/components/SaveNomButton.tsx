import { useAccount, useWriteContract } from "wagmi";
import { localhost } from "viem/chains";
import { NOM_ADDRESS } from "@/lib/constants";
import { nomAbi } from "../../../ponder/foundry/abis";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";

const NOM_CONTRACT = {
  address: NOM_ADDRESS,
  abi: nomAbi,
} as const;

const SaveNomButton = () => {
  const { address } = useAccount();
  const { writeContract, data, error, isPending } = useWriteContract();
  const layers = useNomBuilderContext((state) => state.layers);

  return (
    <button
      className="bg-[#2B83F6] w-full rounded-lg flex justify-between items-center px-2 py-2"
      onClick={() => {
        console.log("save nom button clicked");
        if (!address) {
          // toast
          return;
        }
        console.log("writing contract");
        writeContract({
          chain: localhost,
          ...NOM_CONTRACT,
          functionName: "mintAndInitialize",
          args: [
            address,
            layers.map((layer) => BigInt(layer.trait.id)),
            layers.map((_) => BigInt(1)),
            layers.map((_) => BigInt(0)),
          ],
        });
      }}
    >
      <span className="pangram-sans font-bold">
        {isPending ? "Saving..." : "Save changes"}
      </span>
      <span className="pangram-sans-compact font-bold text-sm bg-black/30 px-2 py-1 rounded">
        0 ETH
      </span>
    </button>
  );
};

export default SaveNomButton;
