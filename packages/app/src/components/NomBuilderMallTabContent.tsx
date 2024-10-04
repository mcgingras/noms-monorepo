import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getTraits } from "@/actions/getTraits";
import { useSearchParams } from "next/navigation";
import TraitCard from "@/components/TraitCard";
import TraitViewer from "@/components/TraitViewer";

const NomBuilderMallTabContent = () => {
  const [selectedTraitId, setSelectedTraitId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const { data } = useSuspenseQuery({
    queryKey: ["traits-query", type || "all"],
    queryFn: async () => {
      const traits = await getTraits(type || "all");
      return { traits };
    },
  });

  const { traits } = data;

  return (
    <>
      <div className="w-full bg-gray-900 p-2 rounded-lg my-2 flex-1 overflow-y-scroll">
        <div className="flex flex-row flex-wrap gap-4">
          {traits.map((trait: any) => (
            <TraitCard
              key={trait.id}
              trait={trait}
              isActive={selectedTraitId === trait.id}
              onClickTrait={() => setSelectedTraitId(trait.id)}
            />
          ))}
        </div>
      </div>
      {selectedTraitId && <TraitViewer traitId={selectedTraitId} />}
    </>
  );
};

export default NomBuilderMallTabContent;
