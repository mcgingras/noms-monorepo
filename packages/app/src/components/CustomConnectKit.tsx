"use client";

import { ConnectKitButton, Avatar } from "connectkit";
import { useDisconnect } from "wagmi";

const CustomConnectKit = () => {
  const { disconnect } = useDisconnect();

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName, address }) => {
        return (
          <div className="relative">
            <button
              onClick={isConnected ? () => disconnect() : show}
              className={`${
                !isConnected ? "bg-[#2B83F6]" : ""
              } text-white rounded-lg transition-all text-sm font-bold pangram-sans-compact px-2 py-1.5`}
            >
              {isConnected ? (
                <span className="flex flex-row items-center space-x-1.5">
                  <div className="bg-[#4b4b4b] rounded-full p-0.5">
                    <Avatar address={address} size={16} />
                  </div>
                  <span className="pangram-sans-compact font-bold text-sm text-gray-200">
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
