import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const LayerItem = ({
  part,
  price,
  index,
}: {
  part: any;
  price?: number;
  index: number;
}) => {
  return (
    <Draggable draggableId={part.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex flex-row items-center bg-gray-1000 hover:bg-gray-900 transition-all p-2 rounded-lg gap-x-3">
            <span className="bg-gray-800 border border-gray-800 h-5 w-5 self-start mt-[2px]">
              <img
                src={`data:image/svg+xml;base64,${part.svg}`}
                alt={part.name}
                className="w-full h-full"
              />
            </span>
            <h4 className="pangram-sans font-bold flex-1">{part.name}</h4>
            {price && (
              <span className="pangram-sans-compact font-semibold text-sm">
                {price} ETH
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

const LayerStack = ({
  parts,
  setParts,
}: {
  parts: any[];
  setParts: (parts: any) => void;
}) => {
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newParts = Array.from(parts);
    const [reorderedItem] = newParts.splice(result.source.index, 1);
    newParts.splice(result.destination.index, 0, reorderedItem);
    setParts(newParts);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <section className="h-full flex flex-col">
        <div className="flex flex-row items-center space-x-2 mb-2">
          <h2 className="oziksoft text-xl">All layers</h2>
          <span className="oziksoft bg-blue-500 rounded-full text-xl h-5 w-5 flex items-center justify-center">
            {parts.length}
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
                  {parts.map((part, idx) => (
                    <LayerItem key={part.id} index={idx} part={part} />
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

        <div className="bg-gray-900 p-1 rounded-lg flex flex-col space-y-2">
          <div className="flex flex-row items-center space-x-1">
            <h3 className="pangram-sans px-1 py-1 text-gray-300">
              Pending changes
            </h3>
            <span className="h-5 w-5 text-sm flex items-center justify-center bg-gray-400 rounded-full">
              {parts.length}
            </span>
          </div>
          <button className="bg-[#2B83F6] w-full rounded-lg flex justify-between items-center px-2 py-2">
            <span className="pangram-sans font-bold">Save changes</span>
            <span className="pangram-sans-compact font-bold text-sm bg-black/30 px-2 py-1 rounded">
              0 ETH
            </span>
          </button>
        </div>
      </section>
    </DragDropContext>
  );
};

export default LayerStack;
