"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Layer, LayerChangeType } from "@/types/layer";

const HeadlessLayerItem = ({
  layer,
  index,
  action,
}: {
  layer: Layer;
  index: number;
  action?: {
    onClick: () => void;
    icon: React.ReactNode;
  };
}) => {
  return (
    <Draggable draggableId={`${layer.trait.id}-${index}`} index={index}>
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
            {layer.trait.svg && (
              <span className="bg-gray-800 border border-gray-800 h-5 w-5 self-start mt-[2px]">
                <img
                  src={`data:image/svg+xml;base64,${layer.trait.svg}`}
                  alt={layer.trait.name}
                  className="w-full h-full"
                />
              </span>
            )}
            <h4 className="pangram-sans font-bold flex-1 truncate overflow-hidden text-ellipsis">
              {layer.trait.name}
            </h4>
            {action && (
              <span
                className="group-hover:visible invisible cursor-pointer"
                onClick={action.onClick}
              >
                {action.icon}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

const HeadlessLayerStack = ({
  title,
  layers,
  setLayers,
  action,
}: {
  title: string;
  layers: Layer[];
  setLayers: (layers: Layer[]) => void;
  action?: {
    onClick: () => void;
    icon: React.ReactNode;
  };
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <section className="h-full flex flex-col w-[288px]">
        {/* <div className="flex flex-row items-center space-x-2 mb-2">
          <h2 className="oziksoft text-xl">{title}</h2>
          <span className="oziksoft bg-blue-500 rounded-full text-xl h-5 w-5 flex items-center justify-center">
            {layers.length}
          </span>
        </div> */}

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
                    <HeadlessLayerItem
                      key={`${layer.trait.id}-${idx}`}
                      index={idx}
                      layer={layer}
                      action={action}
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
        <button
          onClick={() => {}}
          className="w-full bg-blue-500 text-center rounded-lg font-bold pangram-sans flex items-center justify-center gap-2 py-1.5 mb-1"
        >
          Create trait
        </button>
      </section>
    </DragDropContext>
  );
};

export default HeadlessLayerStack;
