import { pad, encodeFunctionData } from "viem";
import { walletClient, publicClient } from "./index";
import { ERC6551RegistryAbi } from "@/abis/ERC6551Registry";
import { nomTraitsAbi, nomAbi } from "../../../../ponder/foundry/abis";
import { localhost } from "viem/chains";
import {
  CHAIN_ID,
  EASEL_ADDRESS,
  ACCOUNT_IMPL_ADDRESS,
  TRAIT_ADDRESS,
  NOM_ADDRESS,
  ERC6551_REGISTRY_ADDRESS,
} from "@/lib/constants";

const erc6551RegistryContract = {
  address: ERC6551_REGISTRY_ADDRESS,
  abi: ERC6551RegistryAbi,
} as const;

const erc1155Contract = {
  address: TRAIT_ADDRESS,
  abi: nomTraitsAbi,
} as const;

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
    const [account] = await walletClient.getAddresses();
    const tx = await walletClient.writeContract({
        chain: localhost,
        account,
        ...erc721Contract,
        functionName: "mintAndInitialize",
        args: [
            to,
            traitTokenIds,
            quantities,
            prices,
        ]
    })

   return tx;
}
