import { createConfig } from "@ponder/core";
import { http, getAddress } from "viem";
import { ERC6551RegistryAbi } from "./abis/ERC6551Registry";
import { easelAbi, nomAbi, nomTraitsAbi } from "./foundry/abis";
import NomDeploy from "../contracts/broadcast/Nom.s.sol/1337/run-latest.json";
import ExtrasDeploy from "../contracts/broadcast/Extras.s.sol/1337/run-latest.json";

const txs = NomDeploy.transactions;
const Extrastxs = ExtrasDeploy.transactions;
const receipts = NomDeploy.receipts;
const extrasReceipts = ExtrasDeploy.receipts;
const easelAddress = getAddress(txs[1]!.contractAddress);
const traitsAddress = getAddress(txs[2]!.contractAddress);
const nomAddress = getAddress(txs[3]!.contractAddress);
const registryAddress = getAddress(Extrastxs[1]!.contractAddress);
const startBlock = parseInt(receipts[0]!.blockNumber);
const startBlockExtras = parseInt(extrasReceipts[0]!.blockNumber);

export default createConfig({
  networks: {
    anvil: {
      chainId: 1337,
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
      address: registryAddress,
      startBlock: startBlockExtras,
    },
  },
});
