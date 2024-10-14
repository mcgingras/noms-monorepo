import Modal from "@/components/Modal";
import { Input } from "@headlessui/react";

const CreateTraitModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  return (
    <Modal open={isOpen} setIsOpen={setIsOpen}>
      <div className="flex flex-row gap-x-4 w-[800px]">
        <div className="w-1/2">
          <h2 className="pangram-sans font-bold text-lg">New trait</h2>
          <div className="w-full aspect-square bg-gray-200 rounded-md"></div>
        </div>
        <div className="w-1/2">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-1">
              <h3 className="text-sm pangram-sans font-medium">Name</h3>
              <input
                type="text"
                className="w-full bg-gray-200 rounded-md p-2"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <h3 className="text-sm pangram-sans">Description</h3>
              <input
                type="textarea"
                className="w-full bg-gray-200 rounded-md p-2"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <h3 className="text-sm pangram-sans">Mint criteria</h3>
              <select className="w-full bg-gray-200 rounded-md p-2">
                <option value="free">Free mint</option>
                <option value="paid">Paid mint</option>
                <option value="whitelist">Whitelist mint</option>
                <option value="capped">Capped mint</option>
              </select>
            </div>
            <div className="flex flex-col gap-y-1">
              <h3 className="text-sm pangram-sans">Type</h3>
              <select className="w-full bg-gray-200 rounded-md p-2">
                <option value="free">Head</option>
                <option value="paid">Body</option>
                <option value="whitelist">Accessory</option>
                <option value="capped">Glasses</option>
                <option value="capped">Other</option>
              </select>
            </div>
            <button className="bg-blue-500 text-white rounded-md p-2 pangram-sans font-bold">
              Create trait
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateTraitModal;
