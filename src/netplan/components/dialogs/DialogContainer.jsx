import React from 'react';
import "./DialogContainer.scss"
import {createGlobalHook, useGlobalHook} from "@devhammed/use-global-hook";

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
  const {dialog, showDialog} = useGlobalHook("dialogStore");

  // No dialog to show available
  if (!dialog)
    return <React.Fragment/>;

  const {
    title,
    children,
    onResult,
    primaryKey,
    cancelKey = "Cancel",
    additionalButtons,
    closeOnOutsideClick = false
  } = dialog;

  /**
   * Function that returns a function that executes onResult()
   *
   * @param pResult result that should be fired to onResult-Consumer
   * @returns {function(): void}
   */
  const fOnResult = (pResult) => () =>
  {
    if (!!onResult)
      onResult(pResult)

    // hide dialog now
    showDialog(null)
  }

  return (
    <div className={"dialog-container"} onClick={evt => closeOnOutsideClick && fOnResult(null)(evt)}>
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
