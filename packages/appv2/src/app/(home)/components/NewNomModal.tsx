import Modal from "@/components/Modal";
import Link from "next/link";

const NewNomModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  return (
    <Modal open={isOpen} setIsOpen={setIsOpen}>
      <div>
        <h1 className="text-2xl">Create a new Nom</h1>
        <Link href="/nom/new">
          <button className="bg-[#FFC700] text-black px-4 py-2 mt-4">
            Create Nom
          </button>
        </Link>
      </div>
    </Modal>
  );
};

export default NewNomModal;
