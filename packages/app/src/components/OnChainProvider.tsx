"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    chains: [baseSepolia],
    transports: {
      [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC!),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: "Prop Lot Protocol",
    appDescription: "PropLot Protocol gets your ideas on-chain.",
    ssr: true,
    // appUrl: "", // TODO: add this when we have it
    // appIcon: "", // TODO: add this when we have it
  })
);

const queryClient = new QueryClient();

export const OnChainProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          mode="light"
          customTheme={{
            "--ck-connectbutton-background": "#ffffff",
            "--ck-connectbutton-border-radius": "8px",
            "--ck-connectbutton-font-size": "15px",
            "--ck-connectbutton-box-shadow": "0px 0px 0px 1px #E5E7EB",
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
