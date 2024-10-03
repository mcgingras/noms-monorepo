"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Layer } from "@/types/layer";
import PendingChangesCard from "./PendingChangesCard";
import ShirtIcon from "@/components/icons/Shirt";
import { LayerChangeType } from "@/types/layer";

const LayerItem = ({
  layer,
  index,
  removeLayer,
  hideLayer,
}: {
  layer: Layer;
  index: number;
  removeLayer: (layer: Layer) => void;
  hideLayer: (layer: Layer) => void;
}) => {
  return (
    <Draggable draggableId={layer.trait.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            className={`flex flex-row items-center hover:bg-gray-900 transition-all p-2 rounded-lg gap-x-3 group ${
              layer.type === LayerChangeType.UNEQUIP
                ? "border border-gray-900 opacity-50"
                : "border border-transparent bg-gray-1000"
            }`}
          >
            <span className="bg-gray-800 border border-gray-800 h-5 w-5 self-start mt-[2px]">
              <img
                src={`data:image/svg+xml;base64,${layer.trait.svg}`}
                alt={layer.trait.name}
                className="w-full h-full"
              />
            </span>
            <h4 className="pangram-sans font-bold flex-1">
              {layer.trait.name}
            </h4>
            <span
              className="group-hover:visible invisible cursor-pointer"
              onClick={() => removeLayer(layer)}
            >
              <ShirtIcon className="h-5 w-5" />
            </span>
            {/* {price && (
              <span className="pangram-sans-compact font-semibold text-sm">
                {price} ETH
              </span>
            )} */}
          </div>
        </div>
      )}
    </Draggable>
  );
};

const LayerStack = ({
  layers,
  setLayers,
  initialLayers,
}: {
  layers: Layer[];
  setLayers: (layers: Layer[]) => void;
  initialLayers: Layer[];
}) => {
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newParts = Array.from(layers);
    const [reorderedItem] = newParts.splice(result.source.index, 1);
    newParts.splice(result.destination.index, 0, reorderedItem);
    setLayers(newParts);
  };

  const removeLayer = (layer: Layer) => {
    if (layer.type === LayerChangeType.FIXED) {
      // update layer to unequip
      setLayers(
        layers.map((l) =>
          l.trait.id === layer.trait.id
            ? { ...l, equipped: false, type: LayerChangeType.UNEQUIP }
            : l
        )
      );
    } else if (layer.type === LayerChangeType.UNEQUIP) {
      // update layer to equip
      setLayers(
        layers.map((l) =>
          l.trait.id === layer.trait.id
            ? { ...l, equipped: true, type: LayerChangeType.FIXED }
            : l
        )
      );
    } else {
      setLayers(layers.filter((l) => l.trait.id !== layer.trait.id));
    }
  };

  const hideLayer = (layer: Layer) => {
    setLayers(
      layers.map((l) =>
        l.trait.id === layer.trait.id ? { ...l, hidden: true } : l
      )
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <section className="h-full flex flex-col w-[288px]">
        <div className="flex flex-row items-center space-x-2 mb-2">
          <h2 className="oziksoft text-xl">All layers</h2>
          <span className="oziksoft bg-blue-500 rounded-full text-xl h-5 w-5 flex items-center justify-center">
            {layers.length}
          </span>
        </div>

        <div className="flex-1 relative overflow-y-hidden">
          <Droppable droppableId="list">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="h-full overflow-y-auto"
              >
                <div className="space-y-1">
                  {layers.map((layer, idx) => (
                    <LayerItem
                      key={layer.trait.id}
                      index={idx}
                      layer={layer}
                      removeLayer={removeLayer}
                      hideLayer={hideLayer}
                    />
                  ))}
                  {provided.placeholder}
                </div>
                {/* spacer */}
                <div className="h-[40px] bg-black"></div>
              </div>
            )}
          </Droppable>
          <div className="absolute h-[60px] w-full bg-gradient-to-t from-black to-transparent bottom-0 left-0"></div>
        </div>
        <PendingChangesCard layers={layers} initialLayers={initialLayers} />
      </section>
    </DragDropContext>
  );
};

export default LayerStack;
