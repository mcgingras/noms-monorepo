import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/SelectInput";
import { Nom } from "@/types/nom";
import { useTraitEditorContext } from "@/stores/traitEditor/context";
import HeadlessLayerStack from "@/components/HeadlessLayerStack";

const NomAndLayerStack = ({ noms }: { noms: Nom[] }) => {
  const layers = useTraitEditorContext((state) => state.layers);
  const setLayers = useTraitEditorContext((state) => state.setLayers);
  const nomId = useTraitEditorContext((state) => state.nomId);

  return (
    <div className="w-[288px] h-full flex flex-col">
      <h3 className="text-white text-lg oziksoft mb-1">Nom</h3>
      <Select defaultValue={nomId || ""}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a Nom" />
        </SelectTrigger>
        <SelectContent>
          {noms?.length === 0 && (
            <div className="text-sm p-2">No noms found</div>
          )}
          {noms?.map((nom: Nom) => (
            <SelectItem key={nom.tokenId} value={nom.tokenId}>
              Nom #{nom.tokenId}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <hr className="my-2 border-gray-900" />
      <div className="flex-1">
        <HeadlessLayerStack
          layers={layers}
          title="All layers"
          setLayers={setLayers}
        />
      </div>
    </div>
  );
};

export default NomAndLayerStack;
