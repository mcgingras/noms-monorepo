"use client";

import { useState } from "react";
import LayerStack from "../(noms)/nom/components/LayerStack";
import NomBuilderCanvas from "../(noms)/nom/components/NomBuilderCanvas";
import NomPreview from "../../components/NomPreview";
import { motion } from "framer-motion";
import { NomBuilderProvider } from "@/stores/nomBuilder/context";
const NomBuilder = () => {
  const [size, setSize] = useState<"small" | "large">("large");

  const toggleSize = () => {
    setSize(size === "small" ? "large" : "small");
  };

  return (
    <NomBuilderProvider nomId={"1"}>
      <main className="h-[calc(100vh-66px)] w-full">
        <section className="pt-12 flex flex-row space-x-2 h-full w-full">
          <LayerStack />
          <NomBuilderCanvas>
            <NomPreview size={size} />
            <motion.div
              className="bg-transparent"
              initial={{ width: size === "small" ? "0px" : "880px" }}
              animate={{ width: size === "small" ? "0px" : "880px" }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1], // Custom bezier curve
              }}
            ></motion.div>
            <motion.div
              //   className="bg-gray-900 p-4 absolute top-2 right-2 h-[calc(100%-16px)] rounded-lg"
              className="absolute top-0 right-0 h-[calc(100%)] p-4 bg-gray-900"
              initial={{ width: size === "small" ? "0px" : "872px" }}
              animate={{ width: size === "small" ? "0px" : "872px" }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1], // Custom bezier curve
              }}
            >
              <div className="relative h-full w-full">
                <motion.div
                  className={`absolute top-1/2 flex flex-row -rotate-90 z-50 transform -translate-y-1/2 cursor-pointer left-[-78px]`}
                  onClick={toggleSize}
                >
                  <svg
                    width="41"
                    height="22"
                    viewBox="0 0 41 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M41 0L41 22L-9.6165e-07 22C8.04908 22 13.1581 13.4499 19.3681 7.97848C28.4233 0.00021212 32.4479 9.78539e-05 41 0Z"
                      fill="#151515"
                    />
                  </svg>
                  <span className="bg-[#151515] h-[22px] px-1 flex items-center justify-center text-xs uppercase oziksoft text-white">
                    {size === "small" ? "Show" : "Hide"}
                  </span>
                  <svg
                    width="41"
                    height="22"
                    viewBox="0 0 41 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 0L-9.61651e-07 22L41 22C32.9509 22 27.8419 13.4499 21.6319 7.97848C12.5767 0.000213219 8.55215 9.86015e-05 0 0Z"
                      fill="#151515"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </NomBuilderCanvas>
        </section>
      </main>
    </NomBuilderProvider>
  );
};

export default NomBuilder;
