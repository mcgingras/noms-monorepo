import BackIcon from "@/components/icons/BackIcon";
import { useRouter } from "next/router";

const BackButton = () => {
  const router = useRouter();
  return (
    <span
      className="flex items-center justify-center p-2 rounded-full border-4 border-neutral-500 bg-neutral-200 hover:bg-neutral-300 transition-colors cursor-pointer"
      onClick={() => {
        router.push("/");
      }}
    >
      <BackIcon className="text-neutral-500" />
    </span>
  );
};

export default BackButton;
