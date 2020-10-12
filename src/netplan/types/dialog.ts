import {StoreHook} from "@devhammed/use-global-hook";

export interface IDialogStore extends StoreHook
{
  dialog: any,
  showDialog: (dialog: any) => void
}
