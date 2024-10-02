const getNomById = async (tokenId: number) => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL!;

  const query = `
    query GetNomById($tokenId: BigInt!) {
      noms (where: { tokenId: $tokenId }) {
        items {
          id
          fullSVG
          tokenId
          traits {
            items {
                equipped
                orderIndex
                trait {
                    id
                    name
                    svg
                    type
                    rleBytes
                }
            }
          }
        }
      }
    }
  `;

  const graphqlRequest = {
    query,
    variables: { tokenId },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(graphqlRequest),
  });

  const data = await response.json();
  const nom = data.data.noms.items[0];
  const sortedTraits = nom.traits.items.sort(
    (a: any, b: any) => b.orderIndex - a.orderIndex
  );

  return {
    ...nom,
    traits: sortedTraits,
  };
};

export default getNomById;
