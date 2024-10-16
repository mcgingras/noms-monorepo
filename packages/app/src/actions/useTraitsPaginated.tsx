import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const getTraits = async ({
  type = "all",
  searchQuery = "",
  creator = "",
  limit = 60,
  pageParam = null,
}: {
  type: string;
  searchQuery: string;
  creator: string;
  limit: number;
  pageParam: string | null;
}) => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL!;

  const query = `
              query GetTraits($type: String!, $searchQuery: String!, $creator: String!, $limit: Int!, $after: String) {
                  traits(where: { type_contains: $type, name_contains: $searchQuery, creator_contains: $creator }, limit: $limit, after: $after) {
                      items {
                        id
                        name
                        rleBytes
                        creator
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
        creator,
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

const getTraitCount = async ({
  type,
  name,
  creator,
}: {
  type: string;
  name: string;
  creator: string;
}) => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL!;

  try {
    const data = await fetch(
      `${url}/api/traits/count?type=${type}&name=${name}&creator=${creator}`
    );
    const json = await data.json();
    return json[0].count;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useTraitsPaginated = ({
  typeFilter = "",
  searchQuery = "",
  creator = "",
}: {
  typeFilter: string;
  searchQuery: string;
  creator: string;
}) => {
  const [cursor, setCursor] = useState<string | null>(null);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);

  const { data, isLoading, error, status } = useQuery({
    queryKey: ["traits", typeFilter, searchQuery, creator, cursor],
    queryFn: ({ pageParam = null }) =>
      getTraits({
        type: typeFilter,
        searchQuery,
        creator,
        limit: 60,
        pageParam: cursor,
      }),
  });

  const { data: traitCount, isLoading: isLoadingTraitCount } = useQuery({
    queryKey: ["traitCount", typeFilter, searchQuery, creator],
    queryFn: () =>
      getTraitCount({ type: typeFilter, name: searchQuery, creator }),
  });

  const handleNext = () => {
    if (data?.pageInfo?.hasNextPage) {
      setCursorStack((prevStack) => [...prevStack, data.pageInfo.endCursor]);
      setCursor(data.pageInfo.endCursor);
    }
  };

  const handlePrevious = () => {
    if (cursorStack.length > 1) {
      const prevCursor = cursorStack[cursorStack.length - 2];
      setCursorStack((prevStack) => prevStack.slice(0, -1));
      setCursor(prevCursor);
    }
  };

  return {
    data: {
      traits: data,
      count: traitCount,
      totalPages: Math.ceil(traitCount / 60),
    },
    isLoading: isLoading || isLoadingTraitCount,
    error,
    status,
    handleNext,
    handlePrevious,
    hasNextPage: data?.pageInfo?.hasNextPage,
    hasPreviousPage: cursorStack.length > 1,
  };
};
