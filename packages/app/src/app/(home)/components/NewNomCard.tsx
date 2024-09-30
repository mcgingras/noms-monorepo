import emptyNom from "/public/images/empty-nom.svg";
import Image from "next/image";
import NewNomAction from "./NewNomAction";

const NewNomCard = () => {
  return (
    <NewNomAction>
      <div className="w-[140px] p-2 rounded-xl bg-[#151515]">
        <div className="relative h-[124px] w-[124px] bg-[#d9d9d9]">
          <Image
            src={emptyNom}
            alt="Empty Nom"
            className="bottom-0 absolute left-[26px]"
          />
        </div>
        <p className="pangram-sans mt-2 text-sm text-left">+ New Nom</p>
      </div>
    </NewNomAction>
  );
};

export default NewNomCard;
