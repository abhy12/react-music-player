import { useRef, MouseEvent } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
   children?: any,
   active: boolean,
   onClose: CallableFunction
}

export default function Modal({ children, active, onClose }: ModalProps )  {
   const modalContainer = document.getElementById( "modal-container" );

   if( !modalContainer )  return <></>

   return(
      <>
         {createPortal( <ModalContent active={active} onClose={onClose}>{children}</ModalContent>, modalContainer )}
      </>
   )
}

function ModalContent({ children, active, onClose }: ModalProps )  {
   const overlayRef = useRef( null );

   function overlayClickHandler( e: MouseEvent<HTMLElement> )  {
      if( typeof onClose !== "function" || !overlayRef.current )  return

      if( e.target === overlayRef.current ) onClose();
   }

   return(
      <div
         className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center${active ? '' : ' hidden'}`}
         ref={overlayRef}
         onClick={overlayClickHandler}
      >
         {children}
      </div>
   )
}
