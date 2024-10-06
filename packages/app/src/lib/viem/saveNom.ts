import { Layer, LayerChangeType } from "@/types/layer";
import { walletClient, publicClient } from "./index";
import { nomTraitsAbi, nomAbi } from "../../../../ponder/foundry/abis";
import { localhost } from "viem/chains";
import { TRAIT_ADDRESS, NOM_ADDRESS } from "@/lib/constants";

const traitContract = {
  address: TRAIT_ADDRESS,
  abi: nomTraitsAbi,
} as const;

const nomContract = {
  address: NOM_ADDRESS,
  abi: nomAbi,
} as const;

// need to update this to check if the user is connected to a smart wallet
// and if so, use the smart wallet to save the nom
export const saveNom = async (nomId: string, layers: Layer[]) => {
  const orderedLayers = [...layers].reverse();
  const [account] = await walletClient.getAddresses();
  const tba = await publicClient.readContract({
    ...nomContract,
    functionName: "getTBAForTokenId",
    args: [BigInt(nomId)],
  });

  // only want to mint the traits that are not already owned
  const unownedTraitLayers = orderedLayers.filter((layer) => !layer.owned);
  let mintTraitTx;
  if (unownedTraitLayers.length > 0) {
    mintTraitTx = await walletClient.writeContract({
      chain: localhost,
      account,
      ...traitContract,
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

  const equipTraitTx = await walletClient.writeContract({
    chain: localhost,
    account,
    ...traitContract,
    functionName: "setEquipped",
    args: [
      BigInt(nomId),
      equippedTraitLayers.map((layer) => BigInt(layer.trait.id)),
    ],
  });

  return { mintTraitTx, equipTraitTx };
};
