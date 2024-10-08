"use client";

import Image from "next/image";
import { Trait } from "@/types/trait";
import { cn, isTraitInStack } from "@/lib/utils";
import ClockIcon from "@/components/icons/Clock";
import RareIcon from "@/components/icons/Rare";
import OwnedIcon from "@/components/icons/Owned";
import EthereumIcon from "./icons/Ethereum";

const TraitCard = ({
  trait,
  isActive,
  onClickTrait,
  actionComponent,
  showFullDetails = true,
}: {
  trait: Trait;
  isActive: boolean;
  onClickTrait: (trait: any) => void;
  actionComponent?: React.ReactNode;
  showFullDetails?: boolean;
}) => {
  const isInStack = isTraitInStack(trait);

  return (
    <div
      className={cn(
        "group bg-[#2d2d2d] w-[100px] h-[100px] rounded-lg relative cursor-pointer ring-0 hover:ring-[3px] ring-transparent ring-offset-4 hover:ring-[#FDCB3F] transition-all",
        isActive ? "ring-[3px] ring-[#FDCB3F]" : "ring-transparent",
        isInStack ? "ring-offset-[#5648ED]" : "ring-offset-gray-900"
      )}
      onClick={onClickTrait}
    >
      <Image
        src={`data:image/svg+xml;base64,${trait.svg}`}
        alt="Trait"
        fill
        className="absolute"
      />
      {showFullDetails && (
        <div className="group-hover:opacity-100 opacity-0 transition-all absolute top-0 left-0 w-full h-full bg-black bg-opacity-30">
          {/* mint type icon */}
          <div className="h-[23px] bg-[#222] rounded-[6px] absolute top-1 left-1 flex items-center justify-center px-2">
            <span className="flex items-center gap-x-1.5 justify-center">
              <ClockIcon className="w-3 h-3" />
              {/* <span className="pangram-sans text-xs leading-[12px] font-bold mt-[1px]">
                6d
              </span> */}
            </span>
          </div>
          {/* owned + rare */}
          <div className="h-[23px] bg-[#222] rounded-[6px] absolute top-1 right-1 flex items-center gap-x-1.5 justify-center px-2">
            <OwnedIcon className="w-3 h-3" />
            <RareIcon className="w-3 h-3" />
          </div>
          {/* price */}
          <div className="h-[23px] bg-[#222] rounded-[6px] absolute bottom-1 right-1 flex items-center gap-x-1.5 justify-center px-2">
            <EthereumIcon className="w-3 h-3" />
            <span className="pangram-sans text-xs leading-[12px] font-bold mt-[1px]">
              0.01
            </span>
          </div>
        </div>
      )}
      {actionComponent}
      {/* {isInStack && (
        <div className="absolute top-0 right-0 bg-red-500 w-4 h-4 rounded-full"></div>
      )} */}
    </div>
  );
};

export default TraitCard;
