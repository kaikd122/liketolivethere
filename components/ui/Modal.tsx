import React from "react";

export interface ModalProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  hideModal?: boolean;
}

function Modal({ children, onClick, hideModal }: ModalProps) {
  if (hideModal) {
    return null;
  }
  return (
    <div
      className="fixed pin z-50 overflow-auto bg-stone-600 flex w-full h-full bg-opacity-50"
      onClick={onClick}
    >
      <div
        className="relative  bg-stone-50 rounded-lg w-[97vw] md:w-[80vw] m-auto flex-col flex"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
