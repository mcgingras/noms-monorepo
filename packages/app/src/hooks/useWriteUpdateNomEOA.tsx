import { useEffect } from "react";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { localhost } from "viem/chains";
import { NOM_ADDRESS, TRAIT_ADDRESS } from "@/lib/constants";
import { nomAbi, nomTraitsAbi } from "../../../ponder/foundry/abis";
import { Layer, LayerChangeType } from "@/types/layer";

const NOM_CONTRACT = {
  address: NOM_ADDRESS,
  abi: nomAbi,
} as const;

const TRAIT_CONTRACT = {
  address: TRAIT_ADDRESS,
  abi: nomTraitsAbi,
} as const;

// Returns contract write function to batch mint then equip new traits
// Since an EOA cannot batch transactions, this needs to be done in 2 steps
const useWriteUpdateNomEOA = ({
  nomId,
  orderedLayers,
}: {
  nomId: string | null;
  orderedLayers: Layer[];
}) => {
  let error = "";
  const { data: tba, error: readNomTBAError } = useReadContract({
    ...NOM_CONTRACT,
    functionName: "getTBAForTokenId",
    args: [BigInt(nomId || 0)],
    query: { enabled: !!nomId },
  });

  const {
    writeContractAsync: mintTraitsAsync,
    data: mintTraitsData,
    error: mintTraitsError,
    isPending: isMintTraitsPending,
  } = useWriteContract();

  const { data: mintTraitsReceipt, isLoading: isMintTraitsReceiptLoading } =
    useWaitForTransactionReceipt({
      hash: mintTraitsData,
      confirmations: 1,
    });

  useEffect(() => {
    if (mintTraitsReceipt) {
      const equippedTraitLayers = orderedLayers.filter(
        (layer) => layer.type !== LayerChangeType.UNEQUIP
      );
      saveNomAsync({
        chain: localhost,
        ...TRAIT_CONTRACT,
        functionName: "setEquipped",
        args: [
          BigInt(nomId as string),
          equippedTraitLayers.map((layer) => BigInt(layer.trait.id)),
        ],
      });
    }
  }, [mintTraitsReceipt]);

  const {
    writeContractAsync: saveNomAsync,
    data: saveNomData,
    error: saveNomError,
    isPending: isSaveNomPending,
  } = useWriteContract();

  const { data: saveNomReceipt, isLoading: isSaveNomReceiptLoading } =
    useWaitForTransactionReceipt({
      hash: saveNomData,
      confirmations: 1,
    });

  const action = async () => {
    if (!tba) {
      error = "Nom TBA not found";
      return;
    }

    const unownedTraitLayers = orderedLayers.filter((layer) => !layer.owned);

    // If we have unowned traits to mint, then we want to use the first transaction to mint them
    // Otherwise, we can go right to equipping. If we do have to mint traits, we need to wait
    // for that transaction to be mined so the state of the blockchain has those traits minted
    // In this case, we will have to wait for the receipt, then we can execute the second transaction
    if (unownedTraitLayers.length > 0) {
      await mintTraitsAsync({
        chain: localhost,
        ...TRAIT_CONTRACT,
        functionName: "batchMintViaModules",
        args: [
          tba,
          unownedTraitLayers.map((layer) => BigInt(layer.trait.id)),
          unownedTraitLayers.map((_layer) => BigInt(1)),
          unownedTraitLayers.map((_layer) => BigInt(0)),
        ],
      });
    } else {
      const equippedTraitLayers = orderedLayers.filter(
        (layer) => layer.type !== LayerChangeType.UNEQUIP
      );
      await saveNomAsync({
        chain: localhost,
        ...TRAIT_CONTRACT,
        functionName: "setEquipped",
        args: [
          BigInt(nomId as string),
          equippedTraitLayers.map((layer) => BigInt(layer.trait.id)),
        ],
      });
    }
  };

  // Todo: fix up when we are returning here
  return {
    action,
    data: saveNomData,
    error,
    receipt: saveNomReceipt,
    isLoading: isSaveNomReceiptLoading || isMintTraitsReceiptLoading,
    isPending: isMintTraitsPending || isSaveNomPending,
  };
};

export default useWriteUpdateNomEOA;
