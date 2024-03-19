import { createConfig } from "@ponder/core";
import { Address, http } from "viem";
import { ERC721Abi } from "./abis/ERC721";
import { ERC1155Abi } from "./abis/ERC1155";
import { ERC6551Abi } from "./abis/ERC6551";
import { EaselAbi } from "./abis/Easel";

const startBlock = 5300000;

export const configAddresses = {
  NFTContract: "0xF1eFc9e4C5238C5bCf3d30774480325893435a2A" as Address,
  ERC1155Contract: "0x8F071320A60E4Aac7dA5FBA5F201F9bcc66f86e9" as Address,
  ERC6551Registry: "0x000000006551c19487814612e58FE06813775758" as Address,
  AccountImpl: "0x41C8f39463A868d3A88af00cd0fe7102F30E44eC" as Address,
  Easel: "0x74c3DbC26278bc2Ef8C7ff1cb7ece926c17adB0a" as Address,
};

export default createConfig({
  networks: {
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.PONDER_RPC_URL_11155111),
    },
  },
  contracts: {
    Easel: {
      network: "sepolia",
      abi: EaselAbi,
      address: configAddresses.Easel,
      startBlock: startBlock,
    },
    NFTContract: {
      network: "sepolia",
      abi: ERC721Abi,
      address: configAddresses.NFTContract,
      startBlock: startBlock,
    },
    ERC1155Contract: {
      network: "sepolia",
      abi: ERC1155Abi,
      address: configAddresses.ERC1155Contract,
      startBlock: startBlock,
    },
    ERC6551Registry: {
      network: "sepolia",
      abi: ERC6551Abi,
      address: configAddresses.ERC6551Registry,
      startBlock: startBlock,
    },
  },
});
