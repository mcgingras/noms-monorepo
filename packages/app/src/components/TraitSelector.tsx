const TraitSelector = () => {
  const notActive = true;

  if (notActive) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">
          Cannot view traits until this nom is activated.
        </p>
      </div>
    );
  }
  return <div className="bg-gray-100 p-6 rounded-lg"></div>;
};

export default TraitSelector;
