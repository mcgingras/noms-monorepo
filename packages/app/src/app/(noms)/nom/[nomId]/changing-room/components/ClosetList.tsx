import Image from "next/image";
import { useAddSearchParam } from "@/hooks/useAddSearchParam";
import { NomTrait } from "@/types/trait";

const ClosetItem = ({ nomTrait }: { nomTrait: NomTrait }) => {
  const addSearchParam = useAddSearchParam();

  return (
    <div
      className="min-w-[100px] aspect-square rounded-lg bg-gray-800 relative z-10 cursor-pointer"
      onClick={() => {
        addSearchParam("trait", nomTrait.trait.id.toString());
      }}
    >
      <div className="absolute top-[-4px] left-[45%] flex flex-col">
        <div className="h-6 w-2 rounded bg-[#3E3D3D] z-20"></div>
        <span className="h-4 w-4 rounded-full bg-black mt-[-10px] ml-[-4px] z-10"></span>
      </div>
      <Image
        src={`data:image/svg+xml;base64,${nomTrait.trait.svg}`}
        alt="Rendered nom"
        className="bottom-0 absolute"
        fill
      />
    </div>
  );
};

const ClosetRow = ({ nomTraits }: { nomTraits: NomTrait[] }) => {
  return (
    <div className="mt-4 flex flex-row flex-wrap gap-2 relative px-2">
      {nomTraits.map((nomTrait) => (
        <ClosetItem key={nomTrait.id} nomTrait={nomTrait} />
      ))}
      <div className="h-8 w-full bg-gray-900 rounded absolute left-0 top-[-8px]"></div>
    </div>
  );
};

const ClosetList = ({ traits }: { traits: NomTrait[] }) => {
  // turn traits from array into array of length 6 arrays
  const rows = traits.reduce((acc, trait, index) => {
    if (index % 6 === 0) {
      acc.push([trait]);
    } else {
      acc[acc.length - 1].push(trait);
    }
    return acc;
  }, [] as NomTrait[][]);

  return (
    <>
      {rows.map((row: any[], index: number) => (
        <ClosetRow key={index} nomTraits={row} />
      ))}
    </>
  );
};

export default ClosetList;
