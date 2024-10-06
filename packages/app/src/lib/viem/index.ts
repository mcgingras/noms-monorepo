import { createPublicClient, createWalletClient, http, custom } from "viem";
import { localhost } from "viem/chains";

export const publicClient = createPublicClient({
  chain: localhost,
  transport: http("http://localhost:8545"),
});

export const getWalletClient = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return createWalletClient({
      chain: localhost,
      transport: custom(window.ethereum),
    });
  }
  return null;
};
