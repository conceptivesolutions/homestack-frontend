import React, {useCallback, useEffect} from 'react';
import "./DialogContainer.scss"
import {createGlobalHook, useGlobalHook} from "@devhammed/use-global-hook";
import {IDialogStore} from "../../types/dialog";

/**
 * Container for the globalHook-Framework and is necessary to open dialogs
 * from another component
 */
export const dialogStore = createGlobalHook('dialogStore', () =>
{
  const [dialog, showDialog] = React.useState(null);
  return {dialog, showDialog}
})

/**
 * Contains a simple rendering panel for dialogs.
 * Only a single dialog at a time can be opened!
 *
 * @returns {JSX.Element}
 */
export default () =>
{
  const {dialog, showDialog} = useGlobalHook("dialogStore") as IDialogStore;

  const {
    title,
    children,
    onResult,
    primaryKey,
    cancelKey = "Cancel",
    additionalButtons,
    closeOnOutsideClick = false
  } = dialog || {};

  /**
   * Function that returns a function that executes onResult()
   *
   * @param pResult result that should be fired to onResult-Consumer
   * @returns {function(): void}
   */
  const fOnResult = useCallback((pResult) => () =>
  {
    if (!!onResult)
      onResult(pResult)

    // hide dialog now
    showDialog(null)
  }, [onResult, showDialog]);

  /**
   * Function that handels the onKeyDown-Event on window instance.
   * Used for ESC and RETURN key for dialogs
   */
  useEffect(() =>
  {
    if (!dialog)
      return;

    const listener = (event: KeyboardEvent) =>
    {
      // Escape-Key
      if (event.keyCode === 27)
        fOnResult(null)();

      // STRG / META Key and ENTER
      else if (event.keyCode === 13 && (event.metaKey || event.ctrlKey))
        fOnResult(primaryKey)();
    };
    window.addEventListener("keydown", listener)
    return () => window.removeEventListener("keydown", listener);
  }, [dialog, primaryKey, fOnResult])

  // No dialog to show available
  if (!dialog)
    return <React.Fragment/>;

  return (
    <div className={"dialog-container"} onClick={() => closeOnOutsideClick && fOnResult(null)()}>
      <div className={"dialog-frame"} onClick={evt => evt.stopPropagation()}>
        <div className={"dialog-titlebar"}>
          <div className={"dialog-title"}>{title}</div>
          <div className={"dialog-control fa fa-times-circle"} onClick={fOnResult(null)}/>
        </div>

        <div className={"dialog-content"}>
          {children}
        </div>

        <div className={"dialog-buttons"}>
          {additionalButtons}
          {cancelKey && <button onClick={fOnResult(cancelKey)}>{cancelKey}</button>}
          {primaryKey && <button className={"primary"} onClick={fOnResult(primaryKey)}>{primaryKey}</button>}
        </div>
      </div>
    </div>
  );
};
