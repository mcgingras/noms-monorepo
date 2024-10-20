import { Address } from "viem";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { Trait } from "@/types/trait";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import { Layer, LayerChangeType } from "@/types/layer";

export const configAddresses = {
  NFTContract: "0x0AEA8ce800c5609e61E799648195620d1B62B3fd" as Address,
  ERC1155Contract: "0xb185d82B82257994c4f252Cc094385657370083b" as Address,
  ERC6551Registry: "0x000000006551c19487814612e58FE06813775758" as Address,
  AccountImpl: "0x41C8f39463A868d3A88af00cd0fe7102F30E44eC" as Address,
  Easel: "0x9320Fc9A6DE47A326fBd12795Ba731859360cdaD" as Address,
  Multicall: "0xcA11bde05977b3631167028862bE2a173976CA11" as Address,
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const isTraitInStack = (trait: Trait) => {
  const layers = useNomBuilderContext((state) => state.layers);
  return layers.some((layer) => layer.trait.id === trait.id);
};

export const hooklessIsTraitInStack = (layers: Layer[], trait: Trait) => {
  return layers.some((layer) => layer.trait.id === trait.id);
};

// A staged trait is one that is in the stack and is not fixed
// a fixed layer is one that is in the stack, but has no changes
export const hooklessIsTraitStaged = (layers: Layer[], trait: Trait) => {
  return layers.some(
    (layer) =>
      layer.trait.id === trait.id && layer.type !== LayerChangeType.FIXED
  );
};

// an equipped trait is one that is in the stack and is equipped
export const hooklessIsTraitEquipped = (layers: Layer[], trait: Trait) => {
  return layers.some((layer) => layer.trait.id === trait.id && layer.equipped);
};

export const truncateAddress = (address: `0x${string}`, length = 6) => {
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};
