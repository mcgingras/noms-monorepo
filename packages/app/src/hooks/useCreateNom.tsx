import { nomAbi } from "../../../ponder/foundry/abis";
import { localhost } from "viem/chains";
import { NOM_ADDRESS } from "@/lib/constants";
import { Layer } from "@/types/layer";
import { useWriteContract } from "wagmi";

const NOM_CONTRACT = {
  address: NOM_ADDRESS,
  abi: nomAbi,
} as const;

const useCreateNom = ({
  to,
  layers,
}: {
  to: `0x${string}`;
  layers: Layer[];
}) => {
  const traitTokenIds = layers.map((layer) => BigInt(layer.trait.id));
  const orderedTraitTokenIds = [...traitTokenIds].reverse();
  const quantities = layers.map((layer) => BigInt(1));
  // TODO: pull proper prices
  const prices = layers.map((layer) => BigInt(0));

  const { writeContract, data, error, isPending, status } = useWriteContract();

  const write = () =>
    writeContract({
      chain: localhost,
      ...NOM_CONTRACT,
      functionName: "mintAndInitialize",
      args: [to, orderedTraitTokenIds, quantities, prices],
    });

  return {
    write,
    data,
    error,
    isPending,
    status,
  };
};

export default useCreateNom;
