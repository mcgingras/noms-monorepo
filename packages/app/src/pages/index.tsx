import React from "react";
import { ConnectKitButton } from "connectkit";
import NomIcon from "../components/icons/NomIcon";
import PrimaryLayout from "@/layouts/PrimaryLayout";

const ScreenCard = () => {
  return (
    <div className="rounded-xl bg-neutral-700 p-4 text-white">
      <div className="rounded-lg bg-neutral-900 p-4">Hello</div>
    </div>
  );
};

export default function App() {
  return (
    <PrimaryLayout>
      <>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col space-y-8">
            <span className="bg-blue-500 h-24 w-24 rounded-full flex items-center justify-center pr-2 pb-2">
              <NomIcon className="h-16 w-16 text-white" />
            </span>
            <span className="bg-gray-100 h-24 w-24 rounded-full block border-4"></span>
            <span className="bg-gray-100 h-24 w-24 rounded-full block border-4"></span>
          </div>
          <div className="w-[400px]">
            <ScreenCard />
          </div>
          <ConnectKitButton />
        </div>

        <button className="bg-blue-500 border-4 border-blue-400 rounded-full px-6 py-2 text-white font-bold fixed bottom-8 left-[calc(50%-50px)]">
          Create
        </button>
      </>
    </PrimaryLayout>
  );
}
