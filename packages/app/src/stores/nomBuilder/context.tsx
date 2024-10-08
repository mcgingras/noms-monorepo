import { createContext, useContext, useRef } from "react";
import {
  createNomBuilderStore,
  NomBuilderStore,
  INomBuilderState,
} from "./store";
import { useQuery } from "@tanstack/react-query";
import getNomById from "@/actions/getNomById";
import { useStore } from "zustand";

const NomBuilderContext = createContext<NomBuilderStore | null>(null);

export const useNomBuilder = () => {
  const context = useContext(NomBuilderContext);
  if (!context) {
    throw new Error("useNomBuilder must be used within a NomBuilderProvider");
  }
  return context;
};

export const useNomBuilderContext = <T,>(
  selector: (state: INomBuilderState) => T
): T => {
  const store = useContext(NomBuilderContext);
  if (!store) throw new Error("Missing NomBuilderContext.Provider in the tree");
  return useStore(store, selector);
};

export const NomBuilderProvider = ({
  children,
  nomId,
}: {
  children: React.ReactNode;
  nomId: string | null;
}) => {
  const storeRef = useRef<NomBuilderStore | null>(null);
  const { data } = useQuery({
    queryKey: ["nom", nomId],
    queryFn: () => getNomById(Number(nomId)),
    enabled: !!nomId,
  });

  // If we have no nom, we are creating a new nom, and can initialize an empty store
  // otherwise, we need to wait for the data to load before initializing the store
  if (!nomId && !storeRef.current) {
    storeRef.current = createNomBuilderStore(null);
  } else {
    if (data && !storeRef.current) {
      storeRef.current = createNomBuilderStore(data);
    }
  }

  if (!storeRef.current) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-gray-1000 p-2 w-full rounded-xl mt-10 animate-pulse">
        <p className="pangram-sans">Loading the Nom Builder</p>
      </div>
    );
  }

  return (
    <NomBuilderContext.Provider value={storeRef.current}>
      {children}
    </NomBuilderContext.Provider>
  );
};
