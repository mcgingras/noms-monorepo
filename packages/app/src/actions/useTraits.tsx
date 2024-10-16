import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const getTraitsInfinite = async ({
  type = "all",
  searchQuery = "",
  limit = 60,
  pageParam = null,
}: {
  type: string;
  searchQuery: string;
  limit: number;
  pageParam: string | null;
}) => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL!;

  const query = `
              query GetTraits($type: String!, $searchQuery: String!, $limit: Int!, $after: String) {
                  traits(where: { type_contains: $type, name_contains: $searchQuery }, limit: $limit, after: $after) {
                      items {
                      id
                      name
                      rleBytes
                      type
                      svg
                      }
                      pageInfo {
                          hasPreviousPage
                          hasNextPage
                          startCursor
                          endCursor
                      }
                  }
              }
             `;

  const graphqlRequest = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        type: type === "all" ? "" : type,
        searchQuery,
        limit,
        after: pageParam,
      },
    }),
  };

  try {
    const data = await fetch(url, graphqlRequest);
    const json = await data.json();
    return json.data.traits;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getTraitCount = async () => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL!;

  try {
    const data = await fetch(`${url}/api/traits/count`);
    const json = await data.json();
    return json[0].count;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useTraits = ({
  typeFilter = "",
  searchQuery = "",
}: {
  typeFilter: string;
  searchQuery: string;
}) => {
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["traits", typeFilter, searchQuery],
    queryFn: ({ pageParam = null }) =>
      getTraitsInfinite({
        type: typeFilter,
        searchQuery,
        limit: 60,
        pageParam: pageParam ?? null,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage.pageInfo.hasNextPage
        ? lastPage.pageInfo.endCursor
        : undefined;
    },
  });

  const { data: traitCount, isLoading: isLoadingTraitCount } = useQuery({
    queryKey: ["traitCount"],
    queryFn: () => getTraitCount(),
  });

  return {
    data: {
      traits: data?.pages.flatMap((page) => page.items) ?? [],
      count: traitCount,
      totalPages: Math.ceil(traitCount / 60),
    },
    isLoading: isLoading || isLoadingTraitCount,
    error,
    hasNextPage,
    fetchNextPage,
    hasPreviousPage,
    fetchPreviousPage,
    isFetching,
    isFetchingNextPage,
    status,
    traitCount,
  };
};
