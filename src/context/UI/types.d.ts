import { ModalDialogPropsVariantOverrides, VariantProp } from "@mui/joy";
import { OverridableStringUnion } from '@mui/types';

export type Severity = 'plain' | 'outlined' | 'soft' | 'solid';
export type ColorPalette = 'primary' | 'neutral' | 'danger' | 'success' | 'warning';

export type ShowAlert = (newMessage: React.ReactNode, newColor?: ColorPalette, newSeverity?: Severity) => void;

type UIContextType = {
  showAlert: ShowAlert;
  showModal: (modalState: ModalProps["ModalState"]) => void;
  closeModal: () => void;
};

export interface ModalProps {
  handleClose: () => void;
  ModalState: {
    open: boolean;
    title?: React.Element;
    titleIcon?: React.Element;
    content?: React.Element;
    variant?: OverridableStringUnion<VariantProp, ModalDialogPropsVariantOverrides> | undefined;
    role?: any;
    Actions?: React.Element;
    color?: ColorPalette;
  }
}

interface State {
  alert: {
    open: boolean;
    message: React.ReactNode;
    variant: Severity;
    color: ColorPalette;
  };
  modal: ModalProps["ModalState"];
}

type Action =
  | { type: 'SHOW_ALERT'; message: React.ReactNode; color?: ColorPalette; severity?: Severity }
  | { type: 'HIDE_ALERT' }
  | { type: 'SHOW_MODAL'; modalState: ModalProps["ModalState"] }
  | { type: 'CLOSE_MODAL' };