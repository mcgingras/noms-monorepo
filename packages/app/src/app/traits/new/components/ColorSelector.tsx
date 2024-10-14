"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { colors } from "@/lib/constants";

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
    <div className="absolute bottom-0 left-0 w-full bg-gray-800 rounded-lg flex flex-col px-2">
      <AnimatePresence initial={false}>
        <motion.div
          ref={expandedContentRef}
          className="flex flex-row gap-2 flex-wrap p-2 overflow-hidden"
          initial={{ height: 0, paddingTop: 0, paddingBottom: 0 }}
          animate={{
            height: showMore ? contentHeight + 32 : 0,
            paddingTop: showMore ? 16 : 0,
            paddingBottom: showMore ? 16 : 0,
          }}
          exit={{ height: 0, paddingTop: 0, paddingBottom: 0 }}
          transition={{
            duration: showMore ? 0.5 : 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {colors.slice(11, 240).map((color) => (
            <div
              onClick={() => {
                setColor(color);
              }}
              key={color}
              className={`w-[20px] h-[20px] rounded-full cursor-pointer ${
                currentColor === color
                  ? "ring-offset-2 ring-2 ring-offset-gray-800 ring-white"
                  : ""
              }`}
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="flex flex-row space-x-4 p-2 bg-gray-800">
        {colors.slice(1, 10).map((color) => (
          <div
            onClick={() => {
              setColor(color);
            }}
            key={color}
            className={`w-[40px] h-[40px] rounded-full cursor-pointer ${
              currentColor === color
                ? "ring-offset-2 ring-2 ring-offset-gray-800 ring-white"
                : ""
            }`}
            style={{ backgroundColor: color }}
          ></div>
        ))}
        <span
          className="text-sm pangram-sans px-2 py-1 rounded cursor-pointer"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Less" : "More"}
        </span>
      </div>
    </div>
  );
};

export default ColorSelector;
