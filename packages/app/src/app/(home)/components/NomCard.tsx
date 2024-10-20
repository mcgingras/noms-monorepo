import Image from "next/image";
import Link from "next/link";
import { Nom } from "@/types/nom";

const NomCard = ({ nom }: { nom: Nom }) => {
  return (
    <Link href={`/nom/${nom.tokenId}`}>
      <div className="w-[140px] p-2 pb-4 rounded-xl bg-[#151515] hover:bg-[#332F2F] hover:ring-[3px] ring-transparent ring-0 hover:ring-[#FDCB3F] transition-all">
        <div className="relative h-[124px] w-[124px] bg-[#d9d9d9]">
          <Image
            src={`data:image/svg+xml;base64,${nom.fullSVG}`}
            alt="Rendered nom"
            className="bottom-0 absolute"
            width={124}
            height={124}
          />
        </div>
        <p className="pangram-sans font-semibold mt-2 text-sm text-left">
          {`Nom ${nom.tokenId}`}
        </p>
      </div>
    </Link>
  );
};

export default NomCard;
