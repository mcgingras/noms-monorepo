"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useNomBuilderContext } from "@/stores/nomBuilder/context";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useWriteUpdateNomEOA from "@/hooks/useWriteUpdateNomEOA";
import useWriteCreateNewNom from "@/hooks/useWriteCreateNewNom";

const SaveNomButton = () => {
  const router = useRouter();
  const { address } = useAccount();
  const nomId = useNomBuilderContext((state) => state.nomId);
  const layers = useNomBuilderContext((state) => state.layers);
  const orderedLayers = [...layers].reverse();
  const saveAndResetState = useNomBuilderContext(
    (state) => state.saveAndResetState
  );

  const {
    action: createNomAction,
    error: createNomError,
    receipt: createNomReceipt,
    isLoading: isCreateNomReceiptLoading,
    isPending: isCreateNomPending,
  } = useWriteCreateNewNom({
    address,
    orderedLayers,
  });

  useEffect(() => {
    if (createNomReceipt) {
      const nomId = createNomReceipt.logs[0].topics[3] as `0x${string}`;
      const parsedNomId = parseInt(nomId, 16);
      router.push(`/nom/${parsedNomId}`);
    }
  }, [createNomReceipt]);

  const {
    action: updateNomAction,
    error: updateNomError,
    receipt: updateNomReceipt,
    isLoading: isUpdateNomLoading,
    isPending: isUpdateNomPending,
  } = useWriteUpdateNomEOA({
    nomId,
    orderedLayers,
  });

  useEffect(() => {
    if (updateNomReceipt) {
      saveAndResetState();
    }
  }, [updateNomReceipt]);

  useEffect(() => {
    if (createNomError || updateNomError) {
      console.error(createNomError);
      toast.error("Error saving nom");
    }
  }, [createNomError, updateNomError]);

  return (
    <button
      className="bg-[#2B83F6] w-full rounded-lg flex justify-between items-center px-2 py-2"
      onClick={async () => {
        if (!!nomId) {
          updateNomAction();
        } else {
          createNomAction();
        }
      }}
    >
      <span className="pangram-sans font-bold">
        {isCreateNomPending || isUpdateNomPending
          ? "Signing tx..."
          : isCreateNomReceiptLoading || isUpdateNomLoading
            ? "Pending..."
            : "Save changes"}
      </span>
      <span className="pangram-sans-compact font-bold text-sm bg-black/30 px-2 py-1 rounded">
        0 ETH
      </span>
    </button>
  );
};

export default SaveNomButton;
