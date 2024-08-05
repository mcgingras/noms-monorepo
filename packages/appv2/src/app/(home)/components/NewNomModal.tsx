import Modal from "@/components/Modal";

const NewNomModal = () => {
  return (
    <Modal open={true} setIsOpen={() => {}}>
      <div>
        <h1 className="text-2xl">Create a new Nom</h1>
        <input
          type="text"
          placeholder="Nom Name"
          className="border border-gray-300 p-2 w-full mt-2"
        />
        <input
          type="text"
          placeholder="Nom Description"
          className="border border-gray-300 p-2 w-full mt-2"
        />
        <button className="bg-[#FFC700] text-black px-4 py-2 mt-4">
          Create Nom
        </button>
      </div>
    </Modal>
  );
};

export default NewNomModal;
