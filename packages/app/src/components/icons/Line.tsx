const LineIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="24"
      height="23"
      viewBox="0 0 24 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        aspectRatio: "24 / 23",
      }}
    >
      <path
        d="M22.125 1.2168L2.125 21.2168"
        stroke="currentColor"
        strokeWidth="2.32708"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LineIcon;
