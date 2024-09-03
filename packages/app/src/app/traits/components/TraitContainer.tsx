import TraitGridUI from "./TraitGridUI";

const getTraits = async () => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
  const query = `
      query GetTraits {
        traits {
            items {
            id
            name
            rleBytes
            type
            svg
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
      variables: {},
    }),
  };

  const data = await fetch(url, graphqlRequest);
  const json = await data.json();
  return json.data.traits.items;
};

const TraitContainer = async () => {
  const traits = await getTraits();
  return <TraitGridUI traits={traits} />;
};

export default TraitContainer;
