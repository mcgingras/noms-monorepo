import { useState } from "react";
import PrimaryLayout from "@/layouts/PrimaryLayout";
import { ConnectKitButton } from "connectkit";
import ArrowLeftIcon from "@/components/icons/ArrowLeftIcon";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import { useNoms } from "@/models/noms/hooks";
import Nom from "@/components/Nom";
import { Nom as NomType } from "@/models/noms/types";
import BackButton from "@/components/ui/BackButton";
import NomLogoIcon from "@/components/icons/NomLogoIcon";

/**
 * for calculating the width and position of each nom
 * total width = screen_size = w
 * w = gap + x + gap + scale_unit*x + gap + scale_unit*scale_unit*x + gap + scale_unit*x + gap + x + gap
 * w = 6*gap + 2*x + 2*scale_unit*x + scale_unit*scale_unit*x
 * (for gap = 20 and sacale_unit = 1.6)
 * w = 6*20 + 2*x + 2*1.6*x + 1.6*1.6*x
 * w = 120 + 2*x + 3.2*x + 2.56*x
 * w = 120 + 7.76*x
 * x = (w - 120) / 7.76
 * x = (screen_size - 120) / 7.76
 */

const GAP_UNIT = 8;
const SCALE_UNIT = 1.6;

const MyNoms = () => {
  const [offset, setOffset] = useState(5);
  const { noms } = useNoms();
  const numberOfNoms = noms.length;

  // @ts-ignore
  const duplicateNoms = (noms, idx) =>
    // @ts-ignore
    noms
      .filter((nom: NomType) => nom.traits.length > 0)
      .map((nom: NomType) => ({ ...nom, id: nom.id + idx }));
  const nomss = [
    { id: "-1", placeholder: true },
    { id: "-2", placeholder: true },
    { id: "-3", placeholder: true },
    { id: "-4", placeholder: true },
    { id: "-5", placeholder: true },
    ...duplicateNoms(noms, 0),
    ...duplicateNoms(noms, 1),
  ];

  const numberOfNomms = nomss.length;
  const nomsWithOffset = nomss.slice(Math.max(offset, 0), offset + 5);

  const CONTAINER_WIDTH = 933;
  const UNIT_WIDTH = (CONTAINER_WIDTH - 120) / 7.76;

  //   const leftInactive = offset === 0;
  //   const rightInactive = offset + 5 >= numberOfNomms;
  const leftInactive = false;
  const rightInactive = false;

  return (
    <div className="w-2/3 mx-auto rounded-lg p-6 bg-[#D5D7E1] h-full flex flex-col">
      <div className="flex flex-row justify-between mb-8">
        <span className="bg-blue-500 h-12 w-12 rounded-full flex items-center justify-center pr-1 pb-1">
          <NomLogoIcon className="h-8 w-8 text-white" />
        </span>
        <span className="text-gray-500">0/2400</span>
      </div>

      <section
        className="flex flex-row w-full justify-between items-center grow"
        onClick={(e) => e.preventDefault()}
      >
        <span
          onClick={() => {
            !leftInactive && setOffset(offset - 1);
          }}
        >
          <ArrowLeftIcon
            className={`${
              leftInactive
                ? "text-neutral-400 cursor-not-allowed"
                : "text-blue-500 cursor-pointer"
            }`}
          />
        </span>
        <div className="relative grow flex items-center">
          {nomsWithOffset.map((nom, idx) => {
            const widthMap = {
              0: `${UNIT_WIDTH}px`,
              1: `${UNIT_WIDTH * SCALE_UNIT}px`,
              2: `${UNIT_WIDTH * SCALE_UNIT * SCALE_UNIT}px`,
              3: `${UNIT_WIDTH * SCALE_UNIT}px`,
              4: `${UNIT_WIDTH}px`,
            };

            const positionMap = {
              0: GAP_UNIT,
              1: 2 * GAP_UNIT + UNIT_WIDTH,
              2: 3 * GAP_UNIT + UNIT_WIDTH + SCALE_UNIT * UNIT_WIDTH,
              3:
                4 * GAP_UNIT +
                UNIT_WIDTH +
                SCALE_UNIT * UNIT_WIDTH +
                SCALE_UNIT * SCALE_UNIT * UNIT_WIDTH,
              4:
                5 * GAP_UNIT +
                UNIT_WIDTH +
                SCALE_UNIT * UNIT_WIDTH +
                SCALE_UNIT * SCALE_UNIT * UNIT_WIDTH +
                SCALE_UNIT * UNIT_WIDTH,
            };

            return (
              <div
                style={{
                  // @ts-ignore
                  width: widthMap[idx],
                  // @ts-ignore
                  transform: `translateX(${positionMap[idx]}px)`,
                }}
                className={`transition-all duration-300 absolute left-0 ${
                  idx === 2 && "cross-border z-10"
                }`}
                key={nom?.id}
              >
                {!nom.placeholder && <Nom nom={nom} />}
              </div>
            );
          })}
        </div>
        <span
          onClick={() => {
            !rightInactive && setOffset(offset + 1);
          }}
        >
          <ArrowRightIcon
            className={`${
              rightInactive
                ? "text-neutral-400 cursor-not-allowed"
                : "text-blue-500 cursor-pointer"
            }`}
          />
        </span>
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
          <BackButton />
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
