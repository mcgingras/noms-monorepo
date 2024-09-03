const TraitCard = ({
  trait,
  isSelected,
  onClick,
}: {
  trait: any;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      key={trait.id}
      className={`w-[77px] h-[77px] rounded-lg p-1 bg-gray-800 cursor-pointer border-2  ${
        isSelected ? "border-[#FDCB3F] " : "border-transparent"
      }`}
      onClick={onClick}
    >
      <img
        src={`data:image/svg+xml;base64,${trait.svg}`}
        alt={trait.name}
        className="w-full h-full rounded-[2px]"
      />
    </div>
  );
};

export default TraitCard;
