import { createPublicClient, custom, http } from "viem";
import { baseSepolia } from "viem/chains";

export const walletClient = createPublicClient({
  chain: baseSepolia,
  transport: custom(window.ethereum!),
});

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});
