import CaratDownIcon from "@/components/icons/CaratDownIcon";
import CaratUpIcon from "@/components/icons/CaratUpIcon";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import { Layer, LayerChangeType } from "@/types/layer";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import SaveNomButton from "./SaveNomButton";

const SmoothAnimatePresence = ({
  children,
  isVisible,
}: {
  children: React.ReactNode;
  isVisible: boolean;
}) => {
  const [isRendered, setIsRendered] = useState(isVisible);
  const isFirstRender = useRef(true);

  if (!isRendered && isVisible) {
    setIsRendered(true);
  }

  const onExitComplete = () => {
    if (!isVisible) {
      setIsRendered(false);
    }
  };

  if (isFirstRender.current) {
    isFirstRender.current = false;
    return children;
  }

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {isRendered && children}
    </AnimatePresence>
  );
};

const ChangeRow = ({ layer }: { layer: Layer }) => {
  if (layer.type === LayerChangeType.FIXED) {
    return null;
  }

  if (layer.type === LayerChangeType.BUY_AND_EQUIP) {
    return (
      <>
        <span className="flex flex-row items-center space-x-2">
          <span className="h-2 w-2 rounded-full block bg-green-500"></span>
          <span className="pangram-sans font-bold text-sm text-gray-300">
            Buy {layer.trait.name}
          </span>
        </span>
        <span className="flex flex-row items-center space-x-2">
          <span className="h-2 w-2 rounded-full block bg-green-500"></span>
          <span className="pangram-sans font-bold text-sm text-gray-300">
            Equip {layer.trait.name}
          </span>
        </span>
      </>
    );
  }

  if (layer.type === LayerChangeType.EQUIP) {
    return (
      <span className="flex flex-row items-center space-x-2">
        <span className="h-2 w-2 rounded-full block bg-green-500"></span>
        <span className="pangram-sans font-bold text-sm text-gray-300">
          Equip {layer.trait.name}
        </span>
      </span>
    );
  }

  if (layer.type === LayerChangeType.UNEQUIP) {
    return (
      <span className="flex flex-row items-center space-x-2">
        <span className="h-2 w-2 rounded-full block bg-red-500"></span>
        <span className="pangram-sans font-bold text-sm text-gray-300">
          Remove {layer.trait.name}
        </span>
      </span>
    );
  }

  return null;
};

const PendingChangesCard = () => {
  const [changesOpen, setChangesOpen] = useState(false);
  const layers = useNomBuilderContext((state) => state.layers);
  const initialLayers = useNomBuilderContext((state) => state.initialLayers);

  const hasLayerOrderChanged =
    layers.length === initialLayers.length &&
    layers.some((layer, index) => {
      return layer.trait.id !== initialLayers[index].trait.id;
    });

  const totalChanges =
    layers.reduce((acc, layer) => {
      if (layer.type === LayerChangeType.BUY_AND_EQUIP) {
        return acc + 2;
      }
      if (layer.type === LayerChangeType.FIXED) {
        return acc;
      }
      return acc + 1;
    }, 0) + (hasLayerOrderChanged ? 1 : 0);

  if (totalChanges === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900 p-1 rounded-lg flex flex-col">
      <div
        className="flex flex-row items-center justify-between cursor-pointer mb-2"
        onClick={() => setChangesOpen(!changesOpen)}
      >
        <div className="flex flex-row items-center space-x-1 w-full">
          <h3 className="pangram-sans px-1 py-1 text-gray-300">
            Pending changes
          </h3>
          <span className="h-5 w-5 text-sm flex items-center justify-center bg-gray-400 rounded-full">
            {totalChanges}
          </span>
        </div>
        {changesOpen ? (
          <CaratDownIcon className="h-4 w-4 text-gray-300 pr-1" />
        ) : (
          <CaratUpIcon className="h-4 w-4 text-gray-300 pr-1" />
        )}
      </div>
      <SmoothAnimatePresence isVisible={changesOpen}>
        <motion.div
          initial="collapsed"
          animate={changesOpen ? "open" : "collapsed"}
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0, height: 0 },
          }}
          className="overflow-scroll"
          transition={{
            duration: 0.3,
            ease: [0.04, 0.62, 0.23, 0.98],
            opacity: { duration: 0.2 },
          }}
          style={{ overflow: "hidden" }}
        >
          <div className="flex flex-col space-y-2 mb-4 px-2">
            {layers.map((layer) => (
              <ChangeRow key={layer.trait.id} layer={layer} />
            ))}
            {hasLayerOrderChanged && (
              <span className="flex flex-row items-center space-x-2">
                <span className="h-2 w-2 rounded-full block bg-gray-500"></span>
                <span className="pangram-sans font-bold text-sm text-gray-300">
                  Reorder layers
                </span>
              </span>
            )}
          </div>
        </motion.div>
      </SmoothAnimatePresence>
      <SaveNomButton />
    </div>
  );
};

export default PendingChangesCard;
