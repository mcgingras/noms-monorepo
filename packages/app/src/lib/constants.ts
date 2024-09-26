import { getAddress } from "viem";
import NomDeploy from "../../../contracts/broadcast/Nom.s.sol/1337/run-latest.json";
import ExtrasDeploy from "../../../contracts/broadcast/Extras.s.sol/1337/run-latest.json";

const Nomtxs = NomDeploy.transactions;
const Extrastxs = ExtrasDeploy.transactions;

export const ACCOUNT_IMPL_ADDRESS = getAddress(Nomtxs[0]!.contractAddress);
export const EASEL_ADDRESS = getAddress(Nomtxs[1]!.contractAddress);
export const TRAIT_ADDRESS = getAddress(Nomtxs[2]!.contractAddress);
export const NOM_ADDRESS = getAddress(Nomtxs[3]!.contractAddress);
export const MULTICALL3_ADDRESS = getAddress(Extrastxs[0]!.contractAddress);
export const ERC6551_REGISTRY_ADDRESS = getAddress(
  Extrastxs[1]!.contractAddress
);
export const CHAIN_ID = 1337; // for some reason this is 1337 in wagmi? 31337 elsewhere
