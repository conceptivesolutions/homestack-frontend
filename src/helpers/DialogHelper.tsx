import {useGlobalHook} from "@devhammed/use-global-hook";
import {IDialogStore} from "../types/dialog";

/**
 * Opens a modal dialog
 *
 * @param pDialog Dialog-Description, which contains title, children,
 * onResult(), primaryKey, cancelKey and additionalButtons
 */
export function openModalDialog(pDialog: any)
{
  const {showDialog} = useGlobalHook("dialogStore") as IDialogStore;
  showDialog(pDialog);
}
