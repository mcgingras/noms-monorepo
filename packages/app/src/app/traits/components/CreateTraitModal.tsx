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
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { TRAIT_ADDRESS } from "@/lib/constants";
import { nomTraitsAbi } from "../../../../../ponder/foundry/abis";
import { useForm, Controller } from "react-hook-form";

const MODULE_TYPES = ["Free", "Paid", "Whitelist", "Capped"];
const TRAIT_TYPES = ["Head", "Body", "Accessory", "Glasses", "Other"];

const CreateTraitModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const { data, writeContract } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });
  const { address } = useAccount();

  const { register, handleSubmit, control } = useForm();

  const onSubmit = async (data: any) => {
    writeContract({
      address: TRAIT_ADDRESS,
      abi: nomTraitsAbi,
      functionName: "registerTrait",
      // functionName: "registerTraitWithMintModule",
      args: [
        customLayer!.trait.rleBytes as `0x${string}`,
        data.name,
        data.type,
        data.description,
        address!,
      ],
    });
  };

  const layers = useTraitEditorContext((state) => state.layers);
  const customLayer = layers.find((layer) => layer.trait.id === "custom");
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[800px] bg-white">
        <form onSubmit={handleSubmit(onSubmit)}>
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
                  {...register("name")}
                  className="w-full bg-gray-200 rounded-md p-2 pangram-sans-compact font-bold"
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <h3 className="text-sm pangram-sans-compact font-bold">
                  Description
                </h3>
                <input
                  type="textarea"
                  {...register("description")}
                  className="w-full bg-gray-200 rounded-md p-2 pangram-sans-compact font-bold"
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <h3 className="text-sm pangram-sans-compact font-bold">Type</h3>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={"head"}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="w-full bg-gray-200 text-black border-none">
                        <SelectValue placeholder="Select a trait type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-200 text-black border-none">
                        {TRAIT_TYPES.map((type) => (
                          <SelectItem
                            key={type}
                            value={type.toLowerCase()}
                            className="text-black focus:bg-gray-300 focus:text-black"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <h3 className="text-sm pangram-sans-compact font-bold">
                  Mint criteria
                </h3>
                <Controller
                  control={control}
                  name="mintCriteria"
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={"free"}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="w-full bg-gray-200 text-black border-none">
                        <SelectValue placeholder="Select a mint criteria" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-200 text-black border-none">
                        {MODULE_TYPES.map((type) => (
                          <SelectItem
                            key={type}
                            value={type.toLowerCase()}
                            className="text-black focus:bg-gray-300 focus:text-black"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex-1" />
              <button
                className="bg-blue-500 text-white rounded-md p-2 pangram-sans font-bold"
                type="submit"
              >
                Create trait
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTraitModal;
