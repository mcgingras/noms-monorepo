import emptyNom from "/public/images/empty-nom.svg";
import Image from "next/image";
import Link from "next/link";
import NewNomAction from "./NewNomAction";

const NomAction = ({
  nomId,
  children,
}: {
  nomId: number;
  children: React.ReactNode;
}) => {
  return <Link href={`/nom/${nomId}`}>{children}</Link>;
};

const NomCard = ({ nomId }: { nomId?: number }) => {
  const ActionWrapper = nomId ? NomAction : NewNomAction;

  return (
    <ActionWrapper nomId={nomId!}>
      <div className="w-[140px] p-2 rounded-xl bg-[#151515]">
        <div className="relative h-[124px] w-[124px] bg-[#d9d9d9]">
          <Image
            src={emptyNom}
            alt="Empty Nom"
            className="bottom-0 absolute left-[26px]"
          />
        </div>
        <p className="pangram-sans mt-2 text-sm text-left">
          {nomId ? `Nom ${nomId}` : "New Nom"}
        </p>
      </div>
    </ActionWrapper>
  );
};

export default NomCard;
