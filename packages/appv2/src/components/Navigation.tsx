import Link from "next/link";
import CustomConnectKit from "./CustomConnectKit";

const Navigation = () => {
  return (
    <div className="flex flex-row justify-between items-center h-[34px]">
      <div className="flex flex-row space-x-4 items-center">
        <h1 className="text-2xl leading-[1] text-[#E3EDE3] font-bold oziksoft align-middle">
          noms
        </h1>
        <div className="flex flex-row mt-[2px] space-x-4">
          <Link href="/">
            <span className="text-[#8E8E8E] pangram-sans font-bold">Noms</span>
          </Link>
          <Link href="/traits">
            <span className="text-[#8E8E8E] pangram-sans font-bold">
              Traits
            </span>
          </Link>
        </div>
      </div>
      {true && (
        <div className="flex flex-row mt-[2px] space-x-4">
          <Link href="/">
            <span className="text-[#8E8E8E] pangram-sans font-bold">Nom 1</span>
          </Link>
          <Link href="/">
            <span className="text-[#8E8E8E] pangram-sans font-bold">
              Closet
            </span>
          </Link>
          <Link href="/traits">
            <span className="text-[#8E8E8E] pangram-sans font-bold">
              Changing room
            </span>
          </Link>
        </div>
      )}
      <CustomConnectKit />
    </div>
  );
};

export default Navigation;
