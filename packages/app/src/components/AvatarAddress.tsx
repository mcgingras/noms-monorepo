import { useEnsName, useEnsAvatar } from "wagmi";
import { truncateAddress } from "@/lib/utils";

const AvatarAddress = ({ address }: { address: `0x${string}` }) => {
  const { data: ensName } = useEnsName({ chainId: 1, address });
  const { data: ensAvatar } = useEnsAvatar({
    chainId: 1,
    name: ensName || "",
  });

  return (
    <div className="flex flex-row items-center gap-x-2">
      {ensAvatar && (
        <img
          src={ensAvatar}
          alt={ensName || ""}
          className="w-4 h-4 rounded-full"
        />
      )}
      <p className="text-sm pangram-sans-compact">
        {ensName || truncateAddress(address)}
      </p>
    </div>
  );
};

export default AvatarAddress;
