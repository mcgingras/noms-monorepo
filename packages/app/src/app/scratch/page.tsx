"use client";

import { useWriteContract, useAccount } from "wagmi";
import { TRAIT_ADDRESS } from "@/lib/constants";
import { nomTraitsAbi } from "../../../../ponder/foundry/abis";

const TRAIT_CONTRACT = {
  address: TRAIT_ADDRESS,
  abi: nomTraitsAbi,
} as const;

const Transfer = () => {
  const { address } = useAccount();
  const {
    data: transferTraitData,
    writeContract: transferTrait,
    error: mintError,
  } = useWriteContract();
  const {
    data: mintTraitData,
    writeContract: mintTrait,
    error: traitError,
  } = useWriteContract();

  console.log(mintError);
  console.log(traitError);

  return (
    <div className="flex flex-col gap-4 pangram-sans max-w-md mx-auto mt-12">
      <h1>Transfer test</h1>
      <p>Testing what happens if we transfer a trait from one nom to another</p>
      <p>Testing what happens if we transfer a trait that we have equipped</p>
      <p>
        Testing what happens if we transfer a trait that we have not equipped
      </p>
      <p>
        Testing what happens if we transfer a trait that is equipped, but we
        have more than one of that trait
      </p>
      <button
        className="bg-blue-500 px-2 py-1.5 rounded-lg"
        onClick={() => {
          transferTrait({
            address: TRAIT_CONTRACT.address,
            abi: TRAIT_CONTRACT.abi,
            functionName: "safeTransferFrom",
            args: [
              address as `0x${string}`, // from
              address as `0x${string}`, // to
              BigInt(1), // id
              BigInt(1), // value
              "0x", // bytes
            ],
          });
        }}
      >
        Transfer
      </button>
      <button
        className="bg-blue-500 px-2 py-1.5 rounded-lg"
        onClick={() => {
          mintTrait({
            address: TRAIT_CONTRACT.address,
            abi: TRAIT_CONTRACT.abi,
            functionName: "mintTo",
            args: [address as `0x${string}`, BigInt(1), BigInt(1)],
          });
        }}
      >
        Mint
      </button>
    </div>
  );
};

export default Transfer;
