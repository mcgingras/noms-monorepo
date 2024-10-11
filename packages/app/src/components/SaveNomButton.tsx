"use client";

import { useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { localhost } from "viem/chains";
import { NOM_ADDRESS, TRAIT_ADDRESS } from "@/lib/constants";
import { nomAbi, nomTraitsAbi } from "../../../ponder/foundry/abis";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import { LayerChangeType } from "@/types/layer";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const NOM_CONTRACT = {
  address: NOM_ADDRESS,
  abi: nomAbi,
} as const;

const TRAIT_CONTRACT = {
  address: TRAIT_ADDRESS,
  abi: nomTraitsAbi,
} as const;

const SaveNomButton = () => {
  const router = useRouter();
  const { address } = useAccount();
  const nomId = useNomBuilderContext((state) => state.nomId);
  const layers = useNomBuilderContext((state) => state.layers);
  const saveAndResetState = useNomBuilderContext(
    (state) => state.saveAndResetState
  );

  const {
    writeContract: createNom,
    data: createNomData,
    error: createNomError,
    isPending: isCreateNomPending,
  } = useWriteContract();

  if (createNomError) {
    console.error(createNomError);
    toast.error("Error creating nom");
  }

  const { data: createNomReceipt, isLoading: isCreateNomReceiptLoading } =
    useWaitForTransactionReceipt({
      hash: createNomData,
      confirmations: 2,
    });

  useEffect(() => {
    if (createNomReceipt) {
      const nomId = createNomReceipt.logs[0].topics[3] as `0x${string}`;
      const parsedNomId = parseInt(nomId, 16);
      router.push(`/nom/${parsedNomId}`);
    }
  }, [createNomReceipt]);

  const {
    writeContractAsync: saveNomAsync,
    data: saveNomData,
    error: saveNomError,
    isPending: isSaveNomPending,
  } = useWriteContract();

  const {
    writeContractAsync: mintTraitsAsync,
    data: mintTraitsData,
    error: mintTraitsError,
    isPending: isMintTraitsPending,
  } = useWriteContract();

  const { data: saveNomReceipt, isLoading: isSaveNomReceiptLoading } =
    useWaitForTransactionReceipt({
      hash: saveNomData,
      confirmations: 2,
    });

  useEffect(() => {
    if (saveNomReceipt) {
      saveAndResetState();
    }
  }, [saveNomReceipt]);

  // classic error here is being on the wrong chain :p
  const { data: tba, error: readNomTBAError } = useReadContract({
    ...NOM_CONTRACT,
    functionName: "getTBAForTokenId",
    args: [BigInt(nomId || 0)],
    query: { enabled: !!nomId },
  });

  return (
    <button
      className="bg-[#2B83F6] w-full rounded-lg flex justify-between items-center px-2 py-2"
      onClick={async () => {
        const orderedLayers = [...layers].reverse();
        if (!address) {
          toast.error("Please connect your wallet");
          return;
        }

        if (!!nomId) {
          if (!tba) {
            toast.error("Nom TBA not found");
            return;
          }
          const unownedTraitLayers = orderedLayers.filter(
            (layer) => !layer.owned
          );

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
          }

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
        } else {
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
        }
      }}
    >
      <span className="pangram-sans font-bold">
        {isCreateNomPending || isSaveNomPending || isMintTraitsPending
          ? "Signing tx..."
          : isCreateNomReceiptLoading || isSaveNomReceiptLoading
            ? "Pending..."
            : "Save changes"}
      </span>
      <span className="pangram-sans-compact font-bold text-sm bg-black/30 px-2 py-1 rounded">
        0 ETH
      </span>
    </button>
  );
};

export default SaveNomButton;
