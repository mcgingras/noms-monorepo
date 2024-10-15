import RenderingNom from "@/components/RenderingNom";
import { useTraitEditorContext } from "@/stores/traitEditor/context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/SelectInput";
import { Dialog, DialogContent } from "@/components/Dialog";

const MODULE_TYPES = ["Free", "Paid", "Whitelist", "Capped"];
const TRAIT_TYPES = ["Head", "Body", "Accessory", "Glasses", "Other"];

const CreateTraitModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const layers = useTraitEditorContext((state) => state.layers);
  const customLayer = layers.find((layer) => layer.trait.id === "custom");
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[800px] bg-white">
        <div className="flex flex-row gap-x-4">
          <div className="w-1/2">
            <h2 className="pangram-sans font-bold text-lg">New trait</h2>
            <div className="w-full aspect-square bg-gray-200 rounded-md">
              <RenderingNom layers={[customLayer!]} />
            </div>
          </div>

          <div className="w-1/2 flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-1">
              <h3 className="text-sm pangram-sans-compact font-bold">Name</h3>
              <input
                type="text"
                className="w-full bg-gray-200 rounded-md p-2 pangram-sans-compact font-bold"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <h3 className="text-sm pangram-sans-compact font-bold">
                Description
              </h3>
              <input
                type="textarea"
                className="w-full bg-gray-200 rounded-md p-2 pangram-sans-compact font-bold"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <h3 className="text-sm pangram-sans-compact font-bold">Type</h3>
              <Select defaultValue={"head"}>
                <SelectTrigger className="w-full bg-gray-200 text-black border-none">
                  <SelectValue placeholder="Select a trait type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-200 text-black border-none">
                  {TRAIT_TYPES.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="text-black focus:bg-gray-300 focus:text-black"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-y-1">
              <h3 className="text-sm pangram-sans-compact font-bold">
                Mint criteria
              </h3>
              <Select defaultValue={"free"}>
                <SelectTrigger className="w-full bg-gray-200 text-black border-none">
                  <SelectValue placeholder="Select a mint criteria" />
                </SelectTrigger>
                <SelectContent className="bg-gray-200 text-black border-none">
                  {MODULE_TYPES.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="text-black focus:bg-gray-300 focus:text-black"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1" />
            <button className="bg-blue-500 text-white rounded-md p-2 pangram-sans font-bold">
              Create trait
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTraitModal;
