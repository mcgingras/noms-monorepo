import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

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
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
          <>
            {children}
            <button onClick={() => setIsOpen(false)}>Cancel</button>
            <button onClick={() => setIsOpen(false)}>Deactivate</button>
          </>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default Modal;
