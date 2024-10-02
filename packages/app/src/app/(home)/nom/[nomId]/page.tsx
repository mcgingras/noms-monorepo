import Link from "next/link";
import getNomById from "@/actions/getNomById";
import Image from "next/image";
import TraitCard from "./components/TraitCard";
import TraitViewer from "./components/TraitViewer";

// reset nextjs cache
export const revalidate = 0;

const NomIdPage = async ({
  params: { nomId },
  searchParams,
}: {
  params: { nomId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const nom = await getNomById(Number(nomId));
  const traitId = searchParams.trait;

  const trait = nom?.traits.find(
    (traitJoin: any) => traitJoin.trait.id === traitId
  );

  if (!nom) {
    return <div>Nom not found</div>;
  }

  return (
    <div className="flex-1 min-w-0 flex flex-row space-x-2">
      <div className="flex-grow basis-0 bg-gradient-to-t from-[#222] h-full rounded-lg flex items-center justify-center">
        <div className="w-1/2 bg-gray-900 aspect-square relative">
          <Image
            src={`data:image/svg+xml;base64,${nom.fullSVG}`}
            alt="Rendered nom"
            className="bottom-0 absolute"
            fill
          />
        </div>
      </div>
      <div className="h-full flex flex-col space-y-2 w-auto min-w-[500px]">
        <h3 className="oziksoft text-4xl">Nom {nom.tokenId}</h3>
        <div className="bg-[#151515] w-full rounded-lg p-2 flex-1 relative">
          <h4 className="pangram-sans font-bold">Current fit</h4>
          <div className="flex flex-row space-x-4 mt-2">
            {nom.traits.map((traitJoin: any) => (
              <TraitCard
                trait={traitJoin.trait}
                equipped={traitJoin.equipped}
              />
            ))}
          </div>
          {trait && <TraitViewer trait={trait.trait} />}
        </div>
        <div className="flex flex-row space-x-2 w-full">
          <Link href={`/nom/${nomId}/changing-room`} className="w-1/2">
            <button className="bg-blue-500 rounded-lg px-4 py-2 font-bold pangram-sans w-full">
              Changing room
            </button>
          </Link>
          <button className="bg-[#E3EDE3] text-black rounded-lg px-4 py-2 w-1/2 font-bold pangram-sans">
            Use as template
          </button>
        </div>
      </div>
    </div>
  );
};

export default NomIdPage;
