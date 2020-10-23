import {MutableRefObject, useEffect, useRef} from "react";

/**
 * This function is required, if you want to bind a callback function to the given dependencies
 * but do not trigger a refresh if it changes
 *
 * @param pCallbackFactory Factory to create the function
 * @param pDependencies the dependencies of the function
 */
export function useCallbackNoRefresh<C>(pCallbackFactory: () => C, ...pDependencies: any[]): MutableRefObject<C>
{
  const callbackRef = useRef<C>(pCallbackFactory());

  useEffect(() =>
  {
    callbackRef.current = pCallbackFactory()
  }, [pDependencies, pCallbackFactory])

  return callbackRef;
}
