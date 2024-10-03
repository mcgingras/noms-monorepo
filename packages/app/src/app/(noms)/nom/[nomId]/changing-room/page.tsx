import NomBuilder from "@/components/NomBuilder";

const ChangingRoom = ({
  params,
  searchParams,
}: {
  params: { nomId: string };
  searchParams: { trait: string };
}) => {
  const nomId = params.nomId;
  const selectedTraitId = searchParams.trait;

  return <NomBuilder nomId={nomId} selectedTraitId={selectedTraitId} />;
};

export default ChangingRoom;
