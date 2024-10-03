import NomBuilder from "@/components/NomBuilder";

const NewNomPage = ({ searchParams }: { searchParams: { trait: string } }) => {
  const selectedTraitId = searchParams.trait;

  return <NomBuilder nomId={null} selectedTraitId={selectedTraitId} />;
};

export default NewNomPage;
