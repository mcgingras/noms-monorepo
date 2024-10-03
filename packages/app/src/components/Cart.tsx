const Cart = ({
  pendingParts,
  onClick,
}: {
  pendingParts: any[];
  onClick?: () => void;
}) => {
  return (
    <span
      className="oziksoft text-2xl cursor-pointer gap-x-2 flex flex-row items-center justify-center"
      onClick={onClick}
    >
      <span>Cart</span>
      <span className="bg-blue-500 h-6 w-6 flex items-center justify-center rounded-full">
        {pendingParts.length}
      </span>
    </span>
  );
};

export default Cart;
