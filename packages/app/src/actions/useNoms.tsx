import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const getNomsInfinite = async ({
  limit = 60,
  pageParam = null,
}: {
  limit: number;
  pageParam: string | null;
}) => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL!;

  const query = `
              query GetNoms($limit: Int!, $after: String) {
                  noms(limit: $limit, after: $after) {
                      items {
                        id
                        tokenId
                        owner
                        created
                        deployed
                        fullSVG
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
        limit,
        after: pageParam,
      },
    }),
  };

  try {
    const data = await fetch(url, graphqlRequest);
    const json = await data.json();
    return json.data.noms;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getNomCount = async () => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL!;

  try {
    const data = await fetch(`${url}/api/noms/count`);
    const json = await data.json();
    return json[0].count;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useNoms = () => {
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
    queryKey: ["noms"],
    queryFn: ({ pageParam = null }) =>
      getNomsInfinite({
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

  const { data: nomCount, isLoading: isLoadingNomCount } = useQuery({
    queryKey: ["nomCount"],
    queryFn: () => getNomCount(),
  });

  return {
    data: {
      noms: data?.pages.flatMap((page) => page.items) ?? [],
      count: nomCount,
      totalPages: Math.ceil(nomCount / 60),
    },
    isLoading: isLoading || isLoadingNomCount,
    error,
    hasNextPage,
    fetchNextPage,
    hasPreviousPage,
    fetchPreviousPage,
    isFetching,
    isFetchingNextPage,
    status,
  };
};
