import TraitTab from "./components/TraitTab";
import SoftArrow from "@/components/icons/SoftArrow";
import AnimatedTabsVertical from "@/components/AnimatedTabsVertical";
import Searchbar from "@/components/Searchbar";
import TraitGridUI from "./components/TraitGridUI";
import TraitDetails from "./components/TraitDetails";
import TraitPageClient from "./components/TraitPage.Client";

// clears out next-js cache for viem calls
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "only-no-store";

const getTraits = async (type: string) => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL!;

  const query = `
          query GetTraits($type: String!) {
            traits(where: { type_contains: $type }) {
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
      variables: { type: type === "all" ? "" : type },
    }),
  };

  const data = await fetch(url, graphqlRequest);
  const json = await data.json();
  return json.data.traits.items;
};

const TraitsPage = async ({ searchParams }: { searchParams: any }) => {
  const traits = await getTraits(searchParams.type || "all");
  const selectedTrait =
    traits.find((trait: any) => trait.id === searchParams.trait) || traits[0];

  return (
    <TraitPageClient traits={traits} selectedTrait={selectedTrait}>
      <main className="h-[calc(100vh-66px)] w-full flex flex-col">
        <section className="flex-grow flex flex-col overflow-hidden">
          <div className="pt-12 pb-4 flex flex-row">
            <TraitTab />
          </div>
          <div className="flex-grow flex flex-row space-x-2 overflow-hidden">
            <div className="w-[140px] bg-gray-900 rounded-lg p-2 flex flex-col">
              <span className="bg-gray-800 rounded-full flex items-center justify-center py-1 mb-2">
                <SoftArrow direction="up" />
              </span>
              <div className="flex-grow overflow-y-auto">
                <AnimatedTabsVertical />
              </div>
              <span className="bg-gray-800 rounded-full flex items-center justify-center py-1 mt-2">
                <SoftArrow direction="down" />
              </span>
            </div>
            <div className="flex-1 flex flex-col space-y-2 overflow-hidden">
              <div className="flex flex-row justify-between items-center">
                <Searchbar />
                <div className="flex flex-row items-center space-x-2">
                  <p className="pangram-sans">Page 1 of 9</p>
                  <span className="bg-gray-900 h-6 w-6 rounded-full block"></span>
                </div>
              </div>
              <div className="flex-grow overflow-y-auto">
                <TraitGridUI traits={traits} />
              </div>
            </div>
            <div className="w-[375px] bg-gray-900 rounded-lg">
              <TraitDetails selectedTrait={selectedTrait} />
            </div>
          </div>
        </section>
      </main>
    </TraitPageClient>
  );
};

export default TraitsPage;
