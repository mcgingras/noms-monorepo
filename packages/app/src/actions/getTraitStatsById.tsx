const getTraitStatsById = async (tokenId: number) => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
  const response = await fetch(`${url}/api/traits/stats/${tokenId}`);
  const data = await response.json();
  return data;
};

export default getTraitStatsById;
