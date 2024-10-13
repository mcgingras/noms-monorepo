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
    <div className="w-[288px]">
      <Select defaultValue={nomId || ""}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a Nom" />
        </SelectTrigger>
        <SelectContent>
          {noms?.map((nom: Nom) => (
            <SelectItem key={nom.tokenId} value={nom.tokenId}>
              Nom #{nom.tokenId}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <HeadlessLayerStack
        layers={layers}
        title="All layers"
        setLayers={setLayers}
      />
    </div>
  );
};

export default NomAndLayerStack;
