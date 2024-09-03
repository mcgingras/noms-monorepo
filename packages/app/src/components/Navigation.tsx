import CustomConnectKit from "./CustomConnectKit";
import ClosetIcon from "@/components/icons/Closet";
import StackIcon from "@/components/icons/Stack";
import TraitsIcon from "./icons/Traits";
import HomeIcon from "./icons/Home";
import ActiveNavItem from "./ActiveNavItem";
import Link from "next/link";

const Navigation = () => {
  return (
    <div className="flex flex-row justify-between items-center h-[34px]">
      <div className="flex flex-row space-x-4 items-center">
        <h1 className="text-3xl leading-[1] text-[#E3EDE3] font-bold oziksoft align-middle">
          noms
        </h1>
        <div className="flex flex-row mt-[2px] space-x-2">
          <ActiveNavItem href="/">
            <span className="flex flex-row items-center space-x-2">
              <HomeIcon />
              <span className="pangram-sans-compact font-bold">Noms</span>
            </span>
          </ActiveNavItem>
          <ActiveNavItem href="/traits">
            <span className="flex flex-row items-center space-x-2">
              <TraitsIcon />
              <span className="pangram-sans-compact font-bold">Traits</span>
            </span>
          </ActiveNavItem>
        </div>
      </div>
      {false && (
        <div className="flex flex-row mt-[2px] space-x-2 items-center">
          <span className="flex flex-row items-center space-x-2">
            <span className="text-gray-50 pangram-sans-compact font-bold text-sm px-2 py-1.5">
              Nom 1
            </span>
          </span>
          <ActiveNavItem href="/">
            <span className="space-x-2 flex flex-row items-center">
              <ClosetIcon />
              <span className="pangram-sans-compact font-bold text-sm">
                Closet
              </span>
            </span>
          </ActiveNavItem>
          <ActiveNavItem href="/traits">
            <span className="flex flex-row items-center space-x-2">
              <StackIcon />
              <span className="pangram-sans-compact font-bold text-sm">
                Changing room
              </span>
            </span>
          </ActiveNavItem>
        </div>
      )}
      <div className="flex flex-row items-center">
        <Link href="/traits/new">
          <button>New trait</button>
        </Link>
        <div className="">
          <CustomConnectKit />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
