import useSWR from "swr";
import { Nom } from "./types";
import { useAccount } from "wagmi";

/* -------------------------------------------------------------------------------------------------
 * useNoms
 * -----------------------------------------------------------------------------------------------*/

export const useNoms = () => {
  const user = useAccount();

  const { error, isLoading, mutate, data } = useSWR(
    user.address
      ? {
          url: `http://localhost:42069`,
          args: { adminAddress: user.address },
        }
      : null,
    SWRGetNoms
  );

  const noms = data?.noms || [];
  const isEmpty = noms.length === 0;

  return {
    isLoading: isLoading,
    isEmpty,
    mutate,
    error,
    noms,
  };
};

async function SWRGetNoms({
  url,
  args,
}: {
  url: string;
  args: { adminAddress: string | undefined };
}): Promise<{
  success: boolean;
  noms: Nom[];
}> {
  const query = `
    query GetNomsQuery($owner: String!) {
        noms(where: { owner: $owner }) {
            id
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
        owner: args.adminAddress,
      },
    }),
  };

  const data = await fetch(url, graphqlRequest);
  const json = await data.json();
  return json.data;
}
