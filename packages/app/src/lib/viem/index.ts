import { createPublicClient, createWalletClient, http, custom } from "viem";
import { localhost } from "viem/chains";

export const walletClient = createWalletClient({
  chain: localhost,
  transport: custom(window.ethereum!),
});

export const publicClient = createPublicClient({
  chain: localhost,
  transport: http("http://localhost:8545"),
});
