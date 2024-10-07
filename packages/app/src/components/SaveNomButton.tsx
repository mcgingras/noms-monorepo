import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { localhost } from "viem/chains";
import { NOM_ADDRESS, TRAIT_ADDRESS } from "@/lib/constants";
import { nomAbi, nomTraitsAbi } from "../../../ponder/foundry/abis";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import { LayerChangeType } from "@/types/layer";
import { useParams } from "next/navigation";

const NOM_CONTRACT = {
  address: NOM_ADDRESS,
  abi: nomAbi,
} as const;

const TRAIT_CONTRACT = {
  address: TRAIT_ADDRESS,
  abi: nomTraitsAbi,
} as const;

const SaveNomButton = () => {
  const { address } = useAccount();
  const nomId = useNomBuilderContext((state) => state.nomId);
  const layers = useNomBuilderContext((state) => state.layers);

  const {
    writeContract: createNom,
    data: createNomData,
    error: createNomError,
    isPending: isCreateNomPending,
  } = useWriteContract();

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

  const { data: tba } = useReadContract({
    ...NOM_CONTRACT,
    functionName: "getTBAForTokenId",
    args: [BigInt(nomId as string)],
    query: { enabled: !!nomId },
  });

  return (
    <button
      className="bg-[#2B83F6] w-full rounded-lg flex justify-between items-center px-2 py-2"
      onClick={async () => {
        const orderedLayers = [...layers].reverse();
        if (!address) {
          // toast
          return;
        }
        if (nomId) {
          if (!tba) {
            return;
          }
          const unownedTraitLayers = orderedLayers.filter(
            (layer) => !layer.owned
          );
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
        {isCreateNomPending || isSaveNomPending ? "Saving..." : "Save changes"}
      </span>
      <span className="pangram-sans-compact font-bold text-sm bg-black/30 px-2 py-1 rounded">
        0 ETH
      </span>
    </button>
  );
};

export default SaveNomButton;
