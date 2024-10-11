import React from "react";
import { motion } from "framer-motion";
import RenderingNom from "@/components/RenderingNom";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";

const NomPreview = ({ size }: { size: "small" | "large" }) => {
  const layers = useNomBuilderContext((state) => state.layers);
  const nomId = useNomBuilderContext((state) => state.nomId);

  return (
    <div className="p-1 h-full flex-1">
      <div
        className="h-full w-full rounded-[20px] p-4 flex flex-col"
        style={{
          backgroundColor: "#222222",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='4' cy='4' r='2' fill='%23ffffff' fill-opacity='0.08' /%3E%3Ccircle cx='16' cy='16' r='2' fill='%23ffffff' fill-opacity='0.08' /%3E%3C/svg%3E")`,
          backgroundSize: "20px 20px",
        }}
      >
        <h3 className="oziksoft text-xl">
          {nomId ? `Nom ${nomId}` : "New Nom"}
        </h3>
        <span className="text-sm text-[#818080] pangram-sans font-semibold">
          {nomId ? "" : "Not yet finalized"}
        </span>
        <div className="relative p-4 flex-1 flex items-center justify-center overflow-hidden">
          <motion.div
            className="relative aspect-square bg-gray-1000 w-auto"
            initial={{ height: size === "small" ? "100%" : "50%" }}
            animate={{ height: size === "small" ? "100%" : "50%" }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1], // Custom bezier curve
              delay: size === "small" ? 0.5 : 0,
            }}
          >
            <RenderingNom layers={layers} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NomPreview;
