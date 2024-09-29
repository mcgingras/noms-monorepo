"use client";

import React from "react";
import NewNomModal from "./NewNomModal";

const NewNomAction = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <NewNomModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {children}
      </button>
    </>
  );
};

export default NewNomAction;
