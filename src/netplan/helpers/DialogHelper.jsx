import {useGlobalHook} from "@devhammed/use-global-hook";

/**
 * Opens a modal dialog
 *
 * @param pDialog Dialog-Description, which contains title, children,
 * onResult(), primaryKey, cancelKey and additionalButtons
 */
export function openModalDialog(pDialog)
{
  const {showDialog} = useGlobalHook("dialogStore");
  showDialog(pDialog);
}
