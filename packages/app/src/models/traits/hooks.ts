import useSWR from "swr";
import { Trait } from "./types";
import { useAccount } from "wagmi";

/* -------------------------------------------------------------------------------------------------
 * useTraits
 * -----------------------------------------------------------------------------------------------*/

export const useTraits = () => {
  const user = useAccount();

  const { error, isLoading, mutate, data } = useSWR(
    user.address
      ? {
          url: `http://localhost:42069`,
          args: { adminAddress: user.address },
        }
      : null,
    SWRGetTraits
  );

  const traits = data?.traits || [];
  const isEmpty = traits.length === 0;

  return {
    isLoading: isLoading,
    isEmpty,
    mutate,
    error,
    traits,
  };
};

async function SWRGetTraits({
  url,
  args,
}: {
  url: string;
  args: { adminAddress: string | undefined };
}): Promise<{
  success: boolean;
  traits: Trait[];
}> {
  const query = `
    query GetTraitsQuery {
        traits {
            id
            svg
            name
            type
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
