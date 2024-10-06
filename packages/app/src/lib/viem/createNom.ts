import { getWalletClient } from "./index";
import { nomAbi } from "../../../../ponder/foundry/abis";
import { localhost } from "viem/chains";
import { NOM_ADDRESS } from "@/lib/constants";
import { Layer } from "@/types/layer";

const erc721Contract = {
  address: NOM_ADDRESS,
  abi: nomAbi,
} as const;

// Called when we first create a new nom
export const createNom = async ({
  to,
  layers,
}: {
  to: `0x${string}`;
  layers: Layer[];
}) => {
  const traitTokenIds = layers.map((layer) => BigInt(layer.trait.id));
  const orderedTraitTokenIds = [...traitTokenIds].reverse();
  const quantities = layers.map((layer) => BigInt(1));
  // TODO: pull proper prices
  const prices = layers.map((layer) => BigInt(0));

  const walletClient = getWalletClient();
  if (!walletClient) {
    throw new Error("No wallet client found");
  }

  const [account] = await walletClient.getAddresses();
  const tx = await walletClient.writeContract({
    chain: localhost,
    account,
    ...erc721Contract,
    functionName: "mintAndInitialize",
    args: [to, orderedTraitTokenIds, quantities, prices],
  });

  return tx;
};
