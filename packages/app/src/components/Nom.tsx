import EmptyNom from "./icons/EmptyNomIcon";
import { Nom } from "@/models/noms/types";

const Nom = ({ nom }: { nom: Nom }) => {
  const equippedTraits = nom.traits.filter((trait) => trait.equipped);

  if (equippedTraits.length === 0) {
    return <EmptyNom className="h-full w-full" />;
  }

  return (
    <div>
      <img src={`data:image/svg+xml;base64,${nom.fullSVG}`} alt="Nom" />
    </div>
  );
};

export default Nom;
