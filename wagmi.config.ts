import { defineConfig } from "@wagmi/cli";
import { foundry } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "packages/ponder/foundry/abis.ts",
  contracts: [],
  plugins: [
    foundry({
      project: "packages/contracts",
      include: ["Nom.sol/**", "NomTraits.sol/**", "Easel.sol/**"],
    }),
  ],
});
