"use client";

import NomBuilder from "@/components/NomBuilder";
import { NomBuilderProvider } from "@/stores/nomBuilder/context";

const NewNomPage = () => {
  return (
    <NomBuilderProvider nomId={null}>
      <NomBuilder />
    </NomBuilderProvider>
  );
};

export default NewNomPage;
