import { walletClient } from "./index";
import { nomAbi } from "../../../../ponder/foundry/abis";
import { localhost } from "viem/chains";
import { NOM_ADDRESS } from "@/lib/constants";

const erc721Contract = {
  address: NOM_ADDRESS,
  abi: nomAbi,
} as const;

// Called when we first create a new nom
export const initNom = async ({
  to,
  traitTokenIds,
  quantities,
  prices,
}: {
  to: `0x${string}`;
  traitTokenIds: bigint[];
  quantities: bigint[];
  prices: bigint[];
}) => {
  const orderedTraitTokenIds = [...traitTokenIds].reverse();
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
