"use client";

import Link from "next/link";
import Image from "next/image";
import TraitCard from "@/components/TraitCard";
import TraitViewer from "./components/TraitViewer";
import getNomById from "@/actions/getNomById";
import { useQuery } from "@tanstack/react-query";

const NomIdPage = ({
  params: { nomId },
  searchParams,
}: {
  params: { nomId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { data: nom } = useQuery({
    queryKey: ["nom", nomId],
    queryFn: () => getNomById(Number(nomId)),
  });
  const traitId = searchParams.trait;

  const trait = nom?.traits.find(
    (traitJoin: any) => traitJoin.trait.id === traitId
  );

  if (!nom) {
    return <div>Nom not found</div>;
  }

  return (
    <div className="flex-1 min-w-0 flex flex-row space-x-2">
      <div className="flex-grow basis-0 bg-gradient-to-t from-[#222] h-full rounded-lg flex items-center justify-center min-w-[300px]">
        <div className="w-3/4 bg-transparent aspect-square relative border border-dashed border-gray-900 rounded-lg">
          <Image
            src={`data:image/svg+xml;base64,${nom.fullSVG}`}
            alt="Rendered nom"
            className="bottom-0 absolute"
            fill
          />
        </div>
      </div>
      <div className="h-full flex flex-col space-y-2 w-[580px]">
        <div className="flex flex-row">
          <div className="flex flex-col w-1/2">
            <h3 className="oziksoft text-4xl">Nom {nom.tokenId}</h3>
            <span className="text-[#818080] text-sm pangram-sans">
              Last updated 12 hours ago
            </span>
          </div>
          <div className="flex flex-col w-1/4">
            <h3 className="text-sm pangram-sans font-semibold">Creator</h3>
            <span>{nom.creator}</span>
          </div>
          <div className="flex flex-col w-1/4">
            <h3 className="text-sm pangram-sans font-semibold">TBA address</h3>
            <span>{nom.creator}</span>
          </div>
        </div>

        <div className="bg-[#151515] w-full rounded-lg p-2 flex-1 relative">
          <h4 className="pangram-sans font-bold">Current fit</h4>
          <div className="flex flex-row gap-4 mt-2 flex-wrap">
            {nom.traits.map((traitJoin: any) => (
              <TraitCard
                trait={traitJoin.trait}
                isEquipped={traitJoin.equipped}
                onClickTrait={() => {}}
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
