"use client";

import { useState, useEffect, useRef } from "react";
import { ConnectKitButton } from "connectkit";
import { useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
// import { truncateEthAddress } from "@/lib/utils";

const CustomConnectKit = () => {
  const router = useRouter();
  const { disconnect } = useDisconnect();

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <div className="relative">
            <button
              onClick={isConnected ? () => disconnect() : show}
              className={`${
                !isConnected
                  ? "bg-[#2B83F6] text-white hover:shadow-[0_0_0_2px_rgba(43,131,246,1)]"
                  : "text-white"
              } rounded-md px-2 py-1 transition-all`}
            >
              {isConnected ? (
                <span className="flex flex-row items-center space-x-1">
                  <span className="pangram-sans">
                    {ensName ?? truncatedAddress}
                  </span>
                </span>
              ) : (
                "Connect"
              )}
            </button>
          </div>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

export default CustomConnectKit;
