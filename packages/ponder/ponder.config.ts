import { createConfig } from "@ponder/core";
import { Transport, http } from "viem";

export default createConfig({
  networks: {
    mainnet: {
      chainId: 1,
      transport: http(),
    },
  },
  contracts: {},
});
