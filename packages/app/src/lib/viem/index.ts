import { createPublicClient, createWalletClient, custom, http } from "viem";
import { baseSepolia } from "viem/chains";

export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: custom(window.ethereum!),
});

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});
