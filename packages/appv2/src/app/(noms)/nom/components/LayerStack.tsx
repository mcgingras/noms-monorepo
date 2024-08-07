const LayerItem = ({ price }: { price?: number }) => {
  return (
    <div className="flex flex-row items-center bg-gray-1000 hover:bg-gray-900 transition-all p-2 rounded-lg gap-x-2">
      <span className="bg-gray-800 border border-gray-800 h-5 w-5"></span>
      <h4 className="pangram-sans font-bold flex-1">Title</h4>
      {price && (
        <span className="pangram-sans-compact font-semibold text-sm">
          {price} ETH
        </span>
      )}
    </div>
  );
};

const LayerStack = () => {
  return (
    <section className="h-full flex flex-col">
      <div className="flex flex-row items-center space-x-2 mb-2">
        <h2 className="oziksoft text-xl">All layers</h2>
        <span className="oziksoft bg-blue-500 rounded-full text-xl h-5 w-5 flex items-center justify-center">
          6
        </span>
      </div>

      <div className="flex-1 relative overflow-y-hidden">
        <div className="h-full overflow-y-auto">
          <div className="space-y-1">
            <LayerItem price={1} />
            <LayerItem />
            <LayerItem />
            <LayerItem />
            <LayerItem />
            <LayerItem price={1} />
            <LayerItem />
            <LayerItem />
            <LayerItem />
            <LayerItem price={2.2} />
            <LayerItem price={3} />
            <LayerItem />
            <LayerItem />
            <LayerItem />
            <LayerItem />
            <LayerItem />
            <LayerItem />
            {/* spacer */}
            <div className="h-[40px] bg-black"></div>
          </div>
        </div>
        <div className="absolute h-[60px] w-full bg-gradient-to-t from-black to-transparent bottom-0 left-0"></div>
      </div>

      <div className="bg-gray-900 p-1 rounded-lg flex flex-col space-y-2">
        <h3 className="pangram-sans px-1 py-1 text-gray-300">
          Pending changes
        </h3>
        <button className="bg-[#2B83F6] w-full rounded-lg flex justify-between items-center px-2 py-2">
          <span className="pangram-sans font-bold">Save changes</span>
          <span className="pangram-sans-compact font-bold text-sm bg-black/30 px-2 py-1 rounded">
            2.2 ETH
          </span>
        </button>
      </div>
    </section>
  );
};

export default LayerStack;
