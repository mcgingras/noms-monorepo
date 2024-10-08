"use client";

import {
  WagmiProvider,
  createConfig,
  http,
  useSwitchChain,
  useAccount,
} from "wagmi";
import { localhost } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { useEffect } from "react";

const ChainSwitcher = ({ children }: { children: React.ReactNode }) => {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  useEffect(() => {
    if (chain?.id !== localhost.id) {
      switchChain({ chainId: localhost.id });
    }
  }, [chain, switchChain]);

  return children;
};

const config = createConfig(
  getDefaultConfig({
    chains: [localhost],
    transports: {
      [localhost.id]: http("http://127.0.0.1:8545"),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: "Noms",
    appDescription: "Build your nom and collect traits.",
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
          <ChainSwitcher>{children}</ChainSwitcher>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
