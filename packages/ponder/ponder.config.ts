import { createConfig } from "@ponder/core";
import { Address, http } from "viem";
import { ERC721Abi } from "./abis/ERC721";
import { ERC1155Abi } from "./abis/ERC1155";
import { ERC6551Abi } from "./abis/ERC6551";
import { EaselAbi } from "./abis/Easel";

const startBlock = 13760000;

// BASE SEPOLIA
export const configAddresses = {
  NFTContract: "0x0AEA8ce800c5609e61E799648195620d1B62B3fd" as Address,
  ERC1155Contract: "0xb185d82B82257994c4f252Cc094385657370083b" as Address,
  ERC6551Registry: "0x000000006551c19487814612e58FE06813775758" as Address,
  AccountImpl: "0x41C8f39463A868d3A88af00cd0fe7102F30E44eC" as Address,
  Easel: "0x9320Fc9A6DE47A326fBd12795Ba731859360cdaD" as Address,
};

export default createConfig({
  networks: {
    baseSepolia: {
      chainId: 84532,
      // @ts-ignore
      transport: http(process.env.PONDER_RPC_URL_84532!),
    },
  },
  contracts: {
    Easel: {
      network: "baseSepolia",
      abi: EaselAbi,
      address: configAddresses.Easel,
      startBlock: startBlock,
    },
    NFTContract: {
      network: "baseSepolia",
      abi: ERC721Abi,
      address: configAddresses.NFTContract,
      startBlock: startBlock,
    },
    ERC1155Contract: {
      network: "baseSepolia",
      abi: ERC1155Abi,
      address: configAddresses.ERC1155Contract,
      startBlock: startBlock,
    },
    ERC6551Registry: {
      network: "baseSepolia",
      abi: ERC6551Abi,
      address: configAddresses.ERC6551Registry,
      startBlock: startBlock,
    },
  },
});
