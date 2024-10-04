import { useNomBuilderContext } from "@/stores/nomBuilder/context";

const Cart = ({ onClick }: { onClick?: () => void }) => {
  const pendingTraits = useNomBuilderContext((state) => state.pendingTraits);
  return (
    <span
      className="oziksoft text-2xl cursor-pointer gap-x-2 flex flex-row items-center justify-center"
      onClick={onClick}
    >
      <span>Cart</span>
      <span className="bg-blue-500 h-6 w-6 flex items-center justify-center rounded-full">
        {pendingTraits.length}
      </span>
    </span>
  );
};

export default Cart;
