import { motion } from "framer-motion";

const WavyTab = ({
  size,
  onClick,
}: {
  size: "small" | "large";
  onClick: () => void;
}) => {
  return (
    <motion.div
      className={`absolute top-1/2 flex flex-row -rotate-90 z-50 transform -translate-y-1/2 cursor-pointer ${
        size === "small" ? "right-[-12px]" : "right-[840px]"
      }`}
      onClick={onClick}
      initial={{ right: size === "small" ? "-12px" : "840px" }}
      animate={{ right: size === "small" ? "-12px" : "840px" }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1], // Custom bezier curve
      }}
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
  );
};

export default WavyTab;
