import PrimaryLayout from "@/layouts/PrimaryLayout";
import { ConnectKitButton } from "connectkit";
import NomViewer from "@/components/NomViewer";
import TraitSelector from "@/components/TraitSelector";
import { useWriteContract, useAccount } from "wagmi";
import { deploys } from "@/utils/constants";
import { ERC721Abi } from "@/abis/ERC721";

const NewNomPage = () => {
  const { address } = useAccount();
  const { data, isPending, writeContract } = useWriteContract();

  const MintNom = async () => {
    if (address) {
      writeContract({
        address: deploys["NPC(721)"] as `0x${string}`,
        abi: ERC721Abi,
        functionName: "mintTo",
        args: [address, BigInt(1)],
      });
    }
  };

  return (
    <PrimaryLayout>
      <div className="h-full">
        <nav className="flex flex-row justify-between mb-12">
          <span></span>
          <ConnectKitButton />
        </nav>
        <section className="grid grid-cols-3 gap-6 h-[calc(100vh-30%)]">
          <TraitSelector />
          <NomViewer id={1} />
        </section>
        <button
          onClick={async () => {
            await MintNom();
          }}
          className="bg-blue-500 border-4 border-blue-400 rounded-full px-6 py-2 text-white font-bold fixed bottom-8 left-[calc(50%-50px)]"
        >
          Buy
        </button>
      </div>
    </PrimaryLayout>
  );
};

export default NewNomPage;
