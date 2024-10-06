import { useState, useEffect } from "react";
import useDebouncedQuery from "@/hooks/useDebouncedQuery";
import SearchIcon from "@/components/icons/Search";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";

const SearchInput = () => {
  const traitSearchQuery = useNomBuilderContext(
    (state) => state.traitSearchQuery
  );
  const setTraitSearchQuery = useNomBuilderContext(
    (state) => state.setTraitSearchQuery
  );

  const [localSearchQuery, setLocalSearchQuery] = useState(traitSearchQuery);
  const debouncedSearchQuery = useDebouncedQuery(localSearchQuery, 300);

  useEffect(() => {
    setTraitSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setTraitSearchQuery]);

  useEffect(() => {
    setLocalSearchQuery(traitSearchQuery);
  }, [traitSearchQuery]);

  return (
    <div className="relative">
      <span className="absolute top-2 left-2">
        <SearchIcon />
      </span>
      <input
        type="text"
        placeholder="Search"
        value={localSearchQuery}
        className="bg-gray-900 w-[200px] block rounded-full py-1 pl-[28px] text-white pangram-sans focus:outline-none"
        onChange={(e) => setLocalSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
