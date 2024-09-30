import NomCard from "./NomCard";
import NewNomCard from "./NewNomCard";
import getNomsByOwner from "@/actions/getNomsByOwner";

const NomList = async () => {
  const noms = await getNomsByOwner(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  );

  if (noms.items.length === 0) {
    return <div>No noms found</div>;
  }

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
