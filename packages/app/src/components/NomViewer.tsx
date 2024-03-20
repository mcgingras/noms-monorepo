import EmptyNom from "./icons/EmptyNom";

const NomViewer = ({ id }: { id: number }) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg flex flex-col">
      <div>
        <span className="text-gray-500 text-2xl">#{id}</span>
      </div>
      <div className="grow flex justify-center">
        <EmptyNom className="h-full w-56" />
      </div>
      <div className="border-t-4 text-gray-500 pt-4 text-center">
        This nom has not yet been activated.
      </div>
    </div>
  );
};

export default NomViewer;
