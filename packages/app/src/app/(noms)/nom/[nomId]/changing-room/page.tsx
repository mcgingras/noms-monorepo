"use client";

import NomBuilder from "../../components/NomBuilder";
import { NomBuilderProvider } from "@/stores/nomBuilder/context";

const ChangingRoom = ({ params }: { params: { nomId: string } }) => {
  const nomId = params.nomId;

  return (
    <NomBuilderProvider nomId={nomId}>
      <NomBuilder />
    </NomBuilderProvider>
  );
};

export default ChangingRoom;
