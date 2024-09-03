import { ERC721Abi } from "@/abis/ERC721";
import { ERC1155Abi } from "@/abis/ERC1155";
import { configAddresses } from "@/lib/utils";
import { walletClient, publicClient } from "./index";
import { MulticallAbi } from "@/abis/Multicall";
import { baseSepolia } from "viem/chains";

const multicallContract = {
  address: configAddresses.Multicall,
  abi: MulticallAbi,
} as const;

const erc1155Contract = {
  address: configAddresses.ERC1155Contract,
  abi: ERC1155Abi,
} as const;

const erc721Contract = {
  address: configAddresses.NFTContract,
  abi: ERC721Abi,
} as const;

export const createNom = async ({ address }: { address: `0x${string}` }) => {
  //   const results = await walletClient.writeContract({
  //   });
  //   return results;
};

export const createSingleNom = async ({
  account,
}: {
  account: `0x${string}`;
}) => {
  const { request } = await publicClient.simulateContract({
    chain: baseSepolia,
    account,
    ...erc721Contract,
    functionName: "mintTo",
    args: [account, BigInt(1)],
  });

  const result = await walletClient.writeContract(request);
  return result;
};
