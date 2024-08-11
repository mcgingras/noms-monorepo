const TraitDetails = ({ selectedTrait }: { selectedTrait: any }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl pangram-sans-compact font-bold">
        {selectedTrait.name}
      </h2>

      <div className="w-full h-[250px] mt-4 bg-gray-1000 rounded-lg p-2">
        <img
          src={`data:image/svg+xml;base64,${selectedTrait.svg}`}
          alt={selectedTrait.name}
          className="w-full h-full rounded-[2px]"
        />
      </div>
    </div>
  );
};

export default TraitDetails;
