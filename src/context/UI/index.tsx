"use client"
import React, { createContext, useContext, useReducer } from 'react';
import Snackbar from '@mui/joy/Snackbar';
import { ModalProps, ShowAlert, State, UIContextType } from './types';
import ModalElements from './elements/ModalElements';
import { UIreducer } from './reducer';

const initialState: State = {
  alert: {
    open: false,
    message: '',
    variant: 'soft',
    color: 'primary',
  },
  modal: {
    open: false,
    variant: 'outlined',
    title: <></>,
    titleIcon: <></>,
    content: <></>,
    role: '',
    Actions: <></>,
  },
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within an UIProvider');
  }
  return context;
};

interface UIProviderProps {
  children: React.ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(UIreducer, initialState);


  const showAlert: ShowAlert = (newMessage, newColor = 'primary', newSeverity = 'soft') => {
    dispatch({ type: 'SHOW_ALERT', message: newMessage, color: newColor, severity: newSeverity });
  };

  const hideAlert = () => {
    dispatch({ type: 'HIDE_ALERT' });
  };

  const showModal = (modalState: ModalProps["ModalState"]) => {
    dispatch({ type: 'SHOW_MODAL', modalState });
  };

  const closeModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  return (
    <UIContext.Provider value={{ showAlert, showModal, closeModal }}>
      <ModalElements ModalState={state.modal} handleClose={closeModal} />
      {children}
      <Snackbar
        open={state.alert.open}
        autoHideDuration={6000}
        onClose={hideAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant={"solid"}
        color={state.alert.color}
      >
        {state.alert.message}
      </Snackbar>
    </UIContext.Provider>
  );
};
