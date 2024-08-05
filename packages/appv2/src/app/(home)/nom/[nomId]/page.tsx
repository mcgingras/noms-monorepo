const NomIdPage = () => {
  return (
    <div className="w-full flex flex-row space-x-2 h-full">
      <div className="flex-1 bg-gradient-to-t from-[#222] h-full rounded-lg"></div>
      <div className="h-full flex flex-col space-y-2">
        <h3 className="oziksoft text-4xl">Nom 1</h3>
        <div className="bg-[#222] w-full rounded-lg p-2 flex-1 relative">
          <h4 className="pangram-sans font-bold">Current fit</h4>
          <div className="flex flex-row space-x-2 mt-2">
            <div className="bg-[#333] w-[100px] h-[100px] rounded-lg"></div>
            <div className="bg-[#333] w-[100px] h-[100px] rounded-lg"></div>
            <div className="bg-[#333] w-[100px] h-[100px] rounded-lg"></div>
            <div className="bg-[#333] w-[100px] h-[100px] rounded-lg"></div>
          </div>
          <div className="p-2 bg-[#333] rounded absolute bottom-2 w-[calc(100%-16px)]">
            <h5>Trait name</h5>
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <button className="bg-blue-500 rounded-lg px-4 py-2 flex-1 font-bold pangram-sans">
            Changing room
          </button>
          <button className="bg-[#E3EDE3] text-black rounded-lg px-4 py-2 flex-1 font-bold pangram-sans">
            Use as template
          </button>
        </div>
      </div>
    </div>
  );
};

export default NomIdPage;
