import PrimaryLayout from "@/layouts/PrimaryLayout";
import { ConnectKitButton } from "connectkit";
import { useReadContract, useAccount } from "wagmi";
import { deploys } from "@/utils/constants";
import EmptyNom from "@/components/icons/EmptyNom";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import { useNoms } from "@/models/noms/hooks";

import { ERC721Abi } from "@/abis/ERC721";

const MyNoms = () => {
  const { address } = useAccount();
  const { noms } = useNoms();
  const { data } = useReadContract({
    address: deploys["NPC(721)"] as `0x${string}`,
    abi: ERC721Abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  console.log(noms);

  return (
    <div className="w-2/3 mx-auto rounded-lg p-6 bg-gray-100 h-full flex flex-col">
      <div className="flex flex-row justify-between mb-8">
        <span></span>
        <span className="text-gray-500">0/2400</span>
      </div>

      <section className="flex flex-row w-full justify-between items-center grow">
        <ArrowLeftIcon className="text-blue-500" />
        {noms.map((nom, idx) => {
          const widthMap = {
            0: "100px",
            1: "150px",
            2: "200px",
            3: "150px",
            4: "100px",
          };

          return (
            <div style={{ width: widthMap[idx] }}>
              <EmptyNom className="h-full w-full" />
            </div>
          );
        })}
        <ArrowRightIcon className="text-blue-500" />
      </section>
      <div className="flex justify-center">
        <button className="bg-blue-500 text-white px-6 py-2 rounded-full border-4 border-blue-400">
          Edit
        </button>
      </div>
    </div>
  );
};

const MyNomsPage = () => {
  return (
    <PrimaryLayout>
      <div className="h-full">
        <nav className="flex flex-row justify-between mb-12">
          <span></span>
          <ConnectKitButton />
        </nav>
        <section className="w-full h-[calc(100vh-30%)]">
          <MyNoms />
        </section>
      </div>
    </PrimaryLayout>
  );
};

export default MyNomsPage;
