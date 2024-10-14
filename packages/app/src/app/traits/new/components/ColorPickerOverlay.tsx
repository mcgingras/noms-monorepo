import React from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

interface ColorPickerOverlayProps {
  colors: string[];
  setColor: (color: string) => void;
  currentColor: string;
  onClose: () => void;
}

const ColorPickerOverlay: React.FC<ColorPickerOverlayProps> = ({
  colors,
  setColor,
  currentColor,
  onClose,
}) => {
  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        exit={{ y: -50 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <div
              key={color}
              onClick={() => setColor(color)}
              className={`w-8 h-8 rounded-full cursor-pointer ${
                currentColor === color
                  ? "ring-2 ring-white ring-offset-2 ring-offset-gray-800"
                  : ""
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default ColorPickerOverlay;
