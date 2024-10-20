"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { colors } from "@/lib/constants";
import CaratDownIcon from "@/components/icons/CaratDownIcon";
import CaratUpIcon from "@/components/icons/CaratUpIcon";

const ColorSelector = ({
  setColor,
  currentColor,
}: {
  setColor: (color: string) => void;
  currentColor: string;
}) => {
  const [showMore, setShowMore] = useState(false);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const updateContentHeight = () => {
    if (expandedContentRef.current) {
      setContentHeight(expandedContentRef.current.scrollHeight);
    }
  };

  useEffect(() => {
    updateContentHeight();

    const handleResize = () => {
      updateContentHeight();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (showMore) {
      updateContentHeight();
    }
  }, [showMore]);

  return (
    <div className="absolute bottom-2.5 left-2 w-[calc(100%-16px)] bg-[#373737] rounded-xl flex flex-col px-2 z-50 shadow-2xl">
      <AnimatePresence initial={false}>
        <motion.div
          ref={expandedContentRef}
          className="flex flex-row gap-2 flex-wrap p-2 overflow-hidden"
          initial={{ height: 0, paddingTop: 0, paddingBottom: 0, opacity: 0 }}
          animate={{
            height: showMore ? contentHeight + 32 : 0,
            paddingTop: showMore ? 16 : 0,
            paddingBottom: showMore ? 16 : 0,
            opacity: showMore ? 1 : 0,
          }}
          exit={{ height: 0, paddingTop: 0, paddingBottom: 0, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.04, 0.62, 0.23, 0.98],
            opacity: { duration: 0.2 },
          }}
        >
          {colors.slice(0, 240).map((color) => (
            <div
              onClick={() => {
                setColor(color);
              }}
              key={color}
              className={`w-[20px] h-[20px] rounded-full cursor-pointer ring-0 hover:ring-offset-2 hover:ring-2 hover:ring-offset-gray-800 hover:ring-white transition-all ${
                currentColor === color
                  ? "ring-offset-2 ring-2 ring-offset-gray-800 ring-white"
                  : ""
              }`}
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-4 p-2 bg-[#373737] items-center">
        {colors.slice(1, 20).map((color) => (
          <div
            onClick={() => {
              setColor(color);
            }}
            key={color}
            className={`w-full aspect-square rounded-full cursor-pointer ring-0 hover:ring-offset-2 hover:ring-2 hover:ring-offset-gray-800 hover:ring-white transition-all ${
              currentColor === color
                ? "ring-offset-2 ring-2 ring-offset-gray-800 ring-white"
                : ""
            }`}
            style={{
              backgroundColor: color,
            }}
          ></div>
        ))}
        <span
          className="cursor-pointer flex-1 flex justify-end"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? (
            <CaratDownIcon className="w-4 h-4" />
          ) : (
            <CaratUpIcon className="w-4 h-4" />
          )}
        </span>
      </div>
    </div>
  );
};

export default ColorSelector;
