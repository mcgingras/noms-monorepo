import ArrowLeftIcon from "@/components/icons/ArrowLeftIcon";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";

export const Pagination = ({
  count,
  currentPage,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  handlePrevious,
  handleNext,
  setPage,
}: {
  count: number;
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  handlePrevious: () => void;
  handleNext: () => void;
  setPage: (page: number) => void;
}) => {
  return (
    <div className="flex flex-row items-center space-x-2">
      <div className="pangram-sans text-sm font-semibold">
        page {count > 0 ? currentPage + 1 : 0} of {totalPages}
      </div>
      <button
        onClick={() => {
          if (hasPreviousPage) {
            handlePrevious();
            setPage(currentPage - 1);
          }
        }}
        className={`${hasPreviousPage ? "bg-gray-900" : "bg-gray-1000"} rounded-full p-2 transition-all`}
      >
        <ArrowLeftIcon
          className={`w-4 h-4 ${hasPreviousPage ? "opacity-100" : "opacity-30"} transition-all`}
        />
      </button>

      <button
        onClick={() => {
          if (hasNextPage) {
            handleNext();
            setPage(currentPage + 1);
          }
        }}
        className={`${hasNextPage ? "bg-gray-900" : "bg-gray-1000"} rounded-full p-2 transition-all`}
      >
        <ArrowRightIcon
          className={`w-4 h-4 ${hasNextPage ? "opacity-100" : "opacity-30"} transition-all`}
        />
      </button>
    </div>
  );
};

export default Pagination;
