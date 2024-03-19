import React from "react";
import Button from "@/components/ui/Button";

const ScreenCard = () => {
  return (
    <div className="rounded-xl bg-neutral-700 p-4 text-white">
      <div className="rounded-lg bg-neutral-900 p-4">Hello</div>
    </div>
  );
};

export default function App() {
  return (
    <main className="h-screen max-w-screen-2xl mx-auto p-8">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col space-y-8">
          <span className="bg-blue-500 h-24 w-24 rounded-full block"></span>
          <span className="bg-gray-100 h-24 w-24 rounded-full block border-4"></span>
          <span className="bg-gray-100 h-24 w-24 rounded-full block border-4"></span>
        </div>
        <div className="w-[400px]">
          <ScreenCard />
        </div>
        <button className="self-start">login</button>
      </div>

      <button className="bg-blue-500 border-4 border-blue-400 rounded-full px-6 py-2 text-white font-bold fixed bottom-8 left-[calc(50%-50px)]">
        Create
      </button>
    </main>
  );
}
