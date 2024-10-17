import SearchIcon from "./icons/Search";
import { useAddSearchParam } from "@/hooks/useAddSearchParam";
import useDebouncedQuery from "@/hooks/useDebouncedQuery";
import { useEffect, useState } from "react";

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const addSearchParam = useAddSearchParam();
  const debouncedSearchQuery = useDebouncedQuery(searchQuery, 300);

  useEffect(() => {
    addSearchParam("searchQuery", debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  return (
    <div className="relative">
      <SearchIcon className="absolute left-[8px] top-[12px]" />
      <input
        type="text"
        placeholder="Search..."
        className="bg-gray-900 rounded-full px-8 py-2 focus:outline-none pangram-sans font-semibold"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default Searchbar;
