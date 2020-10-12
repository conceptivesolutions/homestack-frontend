import {StoreHook} from "@devhammed/use-global-hook";

interface IDialogStore extends StoreHook
{
  dialog: any,
  showDialog: (dialog: any) => void
}
