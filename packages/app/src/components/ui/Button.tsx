const Button = ({ onClick, title }: { title: string; onClick: () => void }) => {
  return (
    <button className="min-w-[100px] rounded-full py-2" onClick={onClick}>
      {title}
    </button>
  );
};

export default Button;
