import { useSuspenseQuery } from "@tanstack/react-query";
import { getTraits } from "@/actions/getTraits";
import { useSearchParams } from "next/navigation";
import TraitCard from "@/components/TraitCard";
import TraitViewer from "@/components/TraitViewer";

const NomBuilderMallTabContent = ({
  onTraitClick,
}: {
  onTraitClick: (trait: any) => void;
}) => {
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
        <div className="flex flex-row flex-wrap gap-2">
          {traits.map((trait: any) => (
            <TraitCard
              key={trait.id}
              trait={trait}
              onClick={() => {
                onTraitClick(trait);
              }}
            />
          ))}
        </div>
      </div>
      <TraitViewer traitId={"1"} />
    </>
  );
};

export default NomBuilderMallTabContent;
