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
  nomId: string;
}) => {
  const storeRef = useRef<NomBuilderStore | null>(null);
  const { data } = useQuery({
    queryKey: ["nom", nomId],
    queryFn: () => getNomById(Number(nomId)),
  });

  if (data && !storeRef.current) {
    storeRef.current = createNomBuilderStore(data);
  }

  if (!storeRef.current) {
    return <p>Loading...</p>;
  }

  return (
    <NomBuilderContext.Provider value={storeRef.current}>
      {children}
    </NomBuilderContext.Provider>
  );
};
