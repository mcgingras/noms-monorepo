const ChangingRoomItem = () => {
  return (
    <div className="min-w-[77px] aspect-square rounded-lg bg-gray-800 relative z-10">
      <div className="absolute top-[-4px] left-[45%] flex flex-col">
        <div className="h-6 w-2 rounded bg-[#3E3D3D] z-10"></div>
        <span className="h-4 w-4 rounded-full bg-black mt-[-10px] ml-[-4px]"></span>
      </div>
    </div>
  );
};

const ChangingRoomRow = () => {
  return (
    <div className="mt-4 flex flex-row flex-wrap gap-2 relative px-2">
      <ChangingRoomItem />
      <ChangingRoomItem />
      <ChangingRoomItem />
      <ChangingRoomItem />
      <ChangingRoomItem />
      <ChangingRoomItem />
      <div className="h-8 w-full bg-gray-900 rounded absolute left-0 top-[-8px]"></div>
    </div>
  );
};

export default ChangingRoomRow;
