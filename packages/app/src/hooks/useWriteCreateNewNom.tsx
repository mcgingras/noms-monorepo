import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { NOM_ADDRESS } from "@/lib/constants";
import { nomAbi } from "../../../ponder/foundry/abis";
import { localhost } from "viem/chains";
import { Layer } from "@/types/layer";

const NOM_CONTRACT = {
  address: NOM_ADDRESS,
  abi: nomAbi,
} as const;

// Returns contract write function to create a new nom
// One function call, so works for EOA + smart wallet
const useWriteCreateNewNom = ({
  address,
  orderedLayers,
}: {
  address: `0x${string}` | undefined;
  orderedLayers: Layer[];
}) => {
  let error;
  const {
    writeContract: createNom,
    data: createNomData,
    error: createNomError,
    isPending: isCreateNomPending,
  } = useWriteContract();

  const { data: createNomReceipt, isLoading: isCreateNomReceiptLoading } =
    useWaitForTransactionReceipt({
      hash: createNomData,
      confirmations: 1,
    });

  const action = () => {
    if (!address) {
      console.error("No address provided");
      error = "No address provided";
      return;
    }
    createNom({
      chain: localhost,
      ...NOM_CONTRACT,
      functionName: "mintAndInitialize",
      args: [
        address,
        orderedLayers.map((layer) => BigInt(layer.trait.id)),
        orderedLayers.map((_) => BigInt(1)),
        orderedLayers.map((_) => BigInt(0)),
      ],
    });
  };

  return {
    action,
    data: createNomData,
    error: createNomError,
    receipt: createNomReceipt,
    isPending: isCreateNomPending,
    isLoading: isCreateNomReceiptLoading,
  };
};

export default useWriteCreateNewNom;
