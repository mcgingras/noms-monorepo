import SearchIcon from "@/components/icons/Search";

const SearchInput = () => {
  return (
    <div className="relative">
      <span className="absolute top-2 left-2">
        <SearchIcon />
      </span>
      <input
        type="text"
        placeholder="Search"
        className="bg-gray-900 w-[200px] block rounded-full py-1 pl-[28px] text-white pangram-sans"
      />
    </div>
  );
};

export default SearchInput;
