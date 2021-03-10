import React, { useState } from "react";
import { Button, Header, Modal } from "semantic-ui-react";

type ApproveDestructiveModalType = {
  title: string,
  trigger: React.ReactNode,
  onProceed?: () => void,
  destructiveActionTitle?: string,
}

/**
 * Modal to declare a "destructive" action
 *
 * @param children Content of this modal
 * @param title Title
 * @param trigger Component that triggers the modal
 * @param onProceed Function that gets executed, if the user accepts the "destructive" action
 * @param destructiveActionTitle Title of the destructive action
 * @constructor
 */
export const ApproveDestructiveModal: React.FC<ApproveDestructiveModalType> = ({ children, title, trigger, onProceed, destructiveActionTitle }) =>
{
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} basic trigger={trigger} size={"tiny"}>
      <Header textAlign={"center"}>
        {title}
      </Header>
      <Modal.Content>
        {children}
      </Modal.Content>
      <Modal.Actions>
        <Button basic inverted onClick={() => setOpen(false)}>Cancel</Button>
        <Button color={"red"} inverted onClick={onProceed}>{destructiveActionTitle || "Delete Permanently"}</Button>
      </Modal.Actions>
    </Modal>
  );
};