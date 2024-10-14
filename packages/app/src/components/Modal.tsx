import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import CloseIcon from "@/components/icons/CloseIcon";

const Modal = ({
  open,
  setIsOpen,
  children,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => setIsOpen(false)}
      as="div"
      className="relative z-50 focus:outline-none"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full min-w-[448px] rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 relative"
          >
            <div className="absolute top-2 right-2">
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center rounded-full bg-gray-200 p-1"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>
            <>{children}</>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
