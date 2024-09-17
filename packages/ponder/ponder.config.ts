import { createConfig } from "@ponder/core";
import { http, getAddress } from "viem";
import { ERC6551RegistryAbi } from "./abis/ERC6551Registry";
import { easelAbi, nomAbi, nomTraitsAbi } from "./foundry/abis";
import NomDeploy from "../contracts/broadcast/Nom.s.sol/31337/run-latest.json";

const txs = NomDeploy.transactions;
const receipts = NomDeploy.receipts;
const easelAddress = getAddress(txs[1]!.contractAddress);
const traitsAddress = getAddress(txs[2]!.contractAddress);
const nomAddress = getAddress(txs[3]!.contractAddress);
const erc6551Registry = getAddress(
  "0x000000006551c19487814612e58fe06813775758"
);
const startBlock = parseInt(receipts[0]!.blockNumber);
console.log(startBlock);

export default createConfig({
  networks: {
    anvil: {
      chainId: 31337,
      // @ts-ignore
      transport: http("http://127.0.0.1:8545"),
      disableCache: true,
    },
  },
  contracts: {
    Easel: {
      network: "anvil",
      abi: easelAbi,
      address: easelAddress,
      startBlock: startBlock,
    },
    NFTContract: {
      network: "anvil",
      abi: nomAbi,
      address: nomAddress,
      startBlock: startBlock,
    },
    ERC1155Contract: {
      network: "anvil",
      abi: nomTraitsAbi,
      address: traitsAddress,
      startBlock: startBlock,
    },
    ERC6551Registry: {
      network: "anvil",
      abi: ERC6551RegistryAbi,
      address: erc6551Registry,
      startBlock: startBlock,
    },
  },
});
