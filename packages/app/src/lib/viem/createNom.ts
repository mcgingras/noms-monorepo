import { pad, encodeFunctionData } from "viem";
import { walletClient, publicClient } from "./index";
import { MulticallAbi } from "@/abis/Multicall";
import { ERC6551RegistryAbi } from "@/abis/ERC6551Registry";
import { nomTraitsAbi, nomAbi } from "../../../../ponder/foundry/abis";
import { localhost } from "viem/chains";
import {
  CHAIN_ID,
  EASEL_ADDRESS,
  ACCOUNT_IMPL_ADDRESS,
  TRAIT_ADDRESS,
  NOM_ADDRESS,
  MULTICALL3_ADDRESS,
  ERC6551_REGISTRY_ADDRESS,
} from "@/lib/constants";

const erc6551RegistryContract = {
  address: ERC6551_REGISTRY_ADDRESS,
  abi: ERC6551RegistryAbi,
} as const;

const multicallContract = {
  address: MULTICALL3_ADDRESS,
  abi: MulticallAbi,
} as const;

const erc1155Contract = {
  address: TRAIT_ADDRESS,
  abi: nomTraitsAbi,
} as const;

const erc721Contract = {
  address: NOM_ADDRESS,
  abi: nomAbi,
} as const;

export const createSingleNom = async ({
  account,
}: {
  account: `0x${string}`;
}) => {
  // simulate minting the nom
  console.log("account", account);
  try {
    const { request: mintResult } = await publicClient.simulateContract({
      chain: localhost,
      account,
      ...erc721Contract,
      functionName: "mintTo",
      args: [account, BigInt(2)],
    });

    const result = await walletClient.writeContract(mintResult);
    return result;
  } catch (e) {
    console.error(e);
    return false;
  }

  //   const result = await walletClient.writeContract(mintResult);
  //   return result;

  //   const bigIntSalt = BigInt(0).toString(16) as `0x${string}`;
  //   const saltHex = pad(bigIntSalt, { size: 32 });

  const mintNomCalldata = encodeFunctionData({
    ...erc721Contract,
    functionName: "mintTo",
    args: [account, BigInt(2)],
  });

  //   const initTBACalldata = encodeFunctionData({
  //     ...erc6551RegistryContract,
  //     functionName: "createAccount",
  //     args: [
  //       ACCOUNT_IMPL_ADDRESS, // impl
  //       saltHex, // salt
  //       BigInt(31337), // chainId
  //       NOM_ADDRESS, // tokenContract
  //       BigInt(2), // tokenId
  //     ],
  //   });

  const { request: multicall } = await publicClient.simulateContract({
    chain: localhost,
    account,
    ...multicallContract,
    functionName: "aggregate",
    args: [
      [
        { target: NOM_ADDRESS, callData: mintNomCalldata },
        // { target: ERC6551_REGISTRY_ADDRESS, callData: initTBACalldata },
      ],
    ],
  });

  //   // 3. mint the traits to the TBA
  //   // 4. equip  the traits?

  //   const result = await walletClient.writeContract(multicall);
  //   return result;
};
