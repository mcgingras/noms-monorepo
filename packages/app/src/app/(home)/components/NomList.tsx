import NomCard from "./NomCard";
import NewNomCard from "./NewNomCard";

const NomList = ({ noms }: { noms: any }) => {
  return (
    <div className="flex flex-row gap-2 flex-wrap">
      <NewNomCard />
      {noms.map((nom: any) => (
        <NomCard nom={nom} key={nom.id} />
      ))}
    </div>
  );
};

export default NomList;
