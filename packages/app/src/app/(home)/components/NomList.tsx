import NomCard from "./NomCard";
import NewNomCard from "./NewNomCard";
import getNomsByOwner from "@/actions/getNomsByOwner";

// revalidate
export const revalidate = 0;

const NomList = async () => {
  const noms = await getNomsByOwner(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  );

  return (
    <div className="flex flex-row gap-2 flex-wrap">
      <NewNomCard />
      {noms.items.map((nom: any) => (
        <NomCard nom={nom} key={nom.id} />
      ))}
    </div>
  );
};

export default NomList;
