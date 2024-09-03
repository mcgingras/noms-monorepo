import SearchIcon from "./icons/Search";

const Searchbar = () => {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-[8px] top-[12px]" />
      <input
        type="text"
        placeholder="Search..."
        className="bg-gray-900 rounded-full px-8 py-2"
      />
    </div>
  );
};

export default Searchbar;
