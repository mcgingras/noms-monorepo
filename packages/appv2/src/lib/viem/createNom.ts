import { ERC721Abi } from "@/abis/ERC721";
import { ERC1155Abi } from "@/abis/ERC1155";
import { configAddresses } from "@/lib/utils";
import { walletClient, publicClient } from "./index";

const erc1155Contract = {
  address: configAddresses.ERC1155Contract,
  abi: ERC1155Abi,
} as const;

const erc721Contract = {
  address: configAddresses.NFTContract,
  abi: ERC721Abi,
} as const;

export const createNom = async ({ address }: { address: `0x${string}` }) => {
  const results = await walletClient.multicall({
    contracts: [
      {
        ...erc721Contract,
        functionName: "mintTo",
        args: [address, BigInt(1)],
      },
    ],
  });

  return results;
};

export const createSingleNom = async ({
  account,
}: {
  account: `0x${string}`;
}) => {
  const { request } = await publicClient.simulateContract({
    account,
    ...erc721Contract,
    functionName: "mintTo",
    args: [account, BigInt(1)],
  });

  await walletClient.writeContract(request);

  return request;
};
