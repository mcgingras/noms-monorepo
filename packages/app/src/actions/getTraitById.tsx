const getTraitById = async (tokenId: number) => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL!;

  const query = `
      query GetTraitById($id: BigInt!) {
        traits (where: { id: $id }) {
          items {
            id
            name
            svg
            type
          }
        }
      }
    `;

  const graphqlRequest = {
    query,
    variables: { id: tokenId },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(graphqlRequest),
  });

  const data = await response.json();
  console.log("data", data);
  return data.data.traits.items[0];
};

export default getTraitById;
