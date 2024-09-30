const getNomsByOwner = async (owner: string) => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL!;

  const query = `
    query GetNomsByOwner($owner: String!) {
    noms(where: { owner: $owner }) {
        items {
            id
            fullSVG
            tokenId
        }
      }
    }
  `;

  const graphqlRequest = {
    query,
    variables: { owner },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(graphqlRequest),
  });

  const data = await response.json();

  return data.data.noms;
};

export default getNomsByOwner;
