import { Action, State } from "./types";

export const UIreducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'SHOW_ALERT':
        return {
          ...state,
          alert: {
            open: true,
            message: action.message,
            variant: action.severity || 'soft',
            color: action.color || 'primary',
          },
        };
      case 'HIDE_ALERT':
        return {
          ...state,
          alert: {
            ...state.alert,
            open: false,
          },
        };
      case 'SHOW_MODAL':

        return {
          ...state,
          modal: {
            ...state.modal,
            ...action.modalState,
            open: true,
          },
        };
      case 'CLOSE_MODAL':
        return {
          ...state,
          modal: {
            ...state.modal,
            open: false,
          },
        };
      default:
        return state;
    }
  };