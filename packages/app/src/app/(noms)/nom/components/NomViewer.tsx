import RenderingNom from "@/components/RenderingNom";
import { Layer } from "@/types/layer";

const NomViewer = ({ layers }: { layers: Layer[] }) => {
  return (
    <div className="p-1 h-full flex-1">
      <div
        className="h-full w-full rounded-[20px] p-4 flex flex-col"
        style={{
          backgroundColor: "#222222",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='4' cy='4' r='2' fill='%23ffffff' fill-opacity='0.08' /%3E%3Ccircle cx='16' cy='16' r='2' fill='%23ffffff' fill-opacity='0.08' /%3E%3C/svg%3E")`,
          backgroundSize: "20px 20px",
        }}
      >
        <h3 className="oziksoft text-xl">Nom 1</h3>
        <span className="text-sm text-[#818080] pangram-sans font-semibold">
          Not yet finalized
        </span>
        <div className="relative p-4 flex-1 flex items-center justify-center overflow-hidden">
          <div className="relative w-2/3 aspect-square bg-gray-1000">
            <RenderingNom layers={layers} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NomViewer;
