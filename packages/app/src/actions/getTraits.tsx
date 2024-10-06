export const getTraits = async (type: string = "all", searchQuery?: string) => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL!;

  const query = `
            query GetTraits($type: String!, $searchQuery: String!) {
                traits(where: { type_contains: $type, name_contains: $searchQuery }, limit: 60) {
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
      variables: { type: type === "all" ? "" : type, searchQuery },
    }),
  };

  const data = await fetch(url, graphqlRequest);
  const json = await data.json();
  return json.data.traits.items;
};
