import EmptyNom from "./icons/EmptyNomIcon";
import { Nom } from "@/models/noms/types";
import { useReadContract } from "wagmi";
import { EaselAbi } from "@/abis/Easel";

const Nom = ({ nom }: { nom: Nom }) => {
  const parts = nom.ownedTraits.map((trait) => {
    return trait.rleBytes;
  });

  console.log(parts);

  //   const { data } = useReadContract({
  //     address: "0x74c3DbC26278bc2Ef8C7ff1cb7ece926c17adB0a",
  //     abi: EaselAbi,
  //     functionName: "generateSVGForParts",
  //     args: [],
  //   });

  if (nom.ownedTraits.length > 0) {
    return <EmptyNom className="h-full w-full" />;
  }

  return <div>not empty!</div>;
};

export default Nom;
