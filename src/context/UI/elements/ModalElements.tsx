import React, { FC } from "react";
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Modal, ModalDialog } from "@mui/joy";
import { ModalProps } from "../types";

const ModalElements: FC<ModalProps> = ({ ModalState, handleClose }): JSX.Element => {
    const { open, variant, title, titleIcon, content, role, Actions , color = "primary" } = ModalState

    
    return (
        <Modal open={open} color={color} onClose={handleClose}>
            <ModalDialog variant={variant} role={role}>
                <DialogTitle>
                    {titleIcon}
                    {title}
                </DialogTitle>
                <Divider />
                <div>
                    {content}
                </div>
                <DialogActions>
                    {Actions}
                </DialogActions>
            </ModalDialog>
        </Modal>
    );
}

export default ModalElements;