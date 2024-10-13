import { createContext, useContext, useRef } from "react";
import {
  createTraitEditorStore,
  TraitEditorStore,
  ITraitEditorState,
} from "./store";
import { useQuery } from "@tanstack/react-query";
import getNomById from "@/actions/getNomById";
import { useStore } from "zustand";

const TraitEditorContext = createContext<TraitEditorStore | null>(null);

export const useTraitEditor = () => {
  const context = useContext(TraitEditorContext);
  if (!context) {
    throw new Error("useTraitEditor must be used within a TraitEditorProvider");
  }
  return context;
};

export const useTraitEditorContext = <T,>(
  selector: (state: ITraitEditorState) => T
): T => {
  const store = useContext(TraitEditorContext);
  if (!store)
    throw new Error("Missing TraitEditorContext.Provider in the tree");
  return useStore(store, selector);
};

export const TraitEditorProvider = ({
  children,
  nomId,
}: {
  children: React.ReactNode;
  nomId: string | null;
}) => {
  const storeRef = useRef<TraitEditorStore | null>(null);
  const { data } = useQuery({
    queryKey: ["nom", nomId],
    queryFn: () => getNomById(Number(nomId)),
    enabled: !!nomId,
  });

  if (nomId === null && !storeRef.current) {
    storeRef.current = createTraitEditorStore(null);
  }
  if (data && !storeRef.current) {
    storeRef.current = createTraitEditorStore(data);
  }

  if (!storeRef.current) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-gray-1000 p-2 w-full rounded-xl mt-10 animate-pulse">
        <p className="pangram-sans">Loading the Trait Editor</p>
      </div>
    );
  }

  return (
    <TraitEditorContext.Provider value={storeRef.current}>
      {children}
    </TraitEditorContext.Provider>
  );
};
