"use client";

import { useSearchParams } from "next/navigation";
import { useAddSearchParam } from "@/hooks/useAddSearchParam";

const TraitPageClient = async ({
  traits,
  selectedTrait,
  children,
}: {
  traits: any[];
  selectedTrait: any;
  children: React.ReactElement;
}) => {
  const addSearchParam = useAddSearchParam();
  const searchParams = useSearchParams();
  const trait = searchParams.get("trait");

  if (trait !== selectedTrait.id) {
    addSearchParam("trait", selectedTrait.id);
  }

  return <div>{children}</div>;
};

export default TraitPageClient;
