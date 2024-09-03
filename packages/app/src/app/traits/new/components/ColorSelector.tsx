const colors = [
  "#1929F4",
  "#AB36BE",
  "#F4C724",
  "#F4A724",
  "#F42424",
  "#24F424",
  "#24F4F4",
  "#2424F4",
  "#F424F4",
];

const ColorSelector = ({
  setColor,
  currentColor,
}: {
  setColor: (color: string) => void;
  currentColor: string;
}) => {
  return (
    <div className="w-full h-[60px] bg-gray-800 rounded-lg flex items-center px-2">
      <div className="flex flex-row space-x-4">
        {colors.map((color) => (
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
      </div>
    </div>
  );
};

export default ColorSelector;
