const ArrowRightIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={`${className} rotate-180`}
      width="35"
      height="45"
      viewBox="0 0 35 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.75787 16.2645C-0.226325 19.4669 -0.226317 25.5331 3.75788 28.7355L21.2382 42.7855C26.4733 46.9933 34.25 43.2665 34.25 36.55L34.25 8.45003C34.25 1.73345 26.4733 -1.99328 21.2381 2.21453L3.75787 16.2645Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ArrowRightIcon;
