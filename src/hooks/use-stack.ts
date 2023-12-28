import { useState, useEffect, useCallback, useRef, MutableRefObject } from "react";
import { callStack } from "../../util/util";

export default function useStack(): [boolean, MutableRefObject<null | Function> ] {
   const [isCurrentStackLoaded, setIsCurrentStackLoaded] = useState( false );
   const nextStackFn = useRef<null | Function>( null );

   const stackCallback = useCallback(( nextFn: Function ) => {
      setIsCurrentStackLoaded( true );

      nextStackFn.current = nextFn;
   }, []);

   useEffect(() => {
      callStack.push( stackCallback );
   }, []);

   return [isCurrentStackLoaded, nextStackFn];
}
