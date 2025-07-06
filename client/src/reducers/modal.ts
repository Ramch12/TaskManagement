import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the modal state interface
export interface ModalState {
  modalType: string;
  modalData: Record<string, any> | null;
}

// Define action payload interfaces
interface OpenModalPayload {
  modalType: string;
  modalData?: Record<string, any>;
}

const initialState: ModalState = {
  modalType: '',
  modalData: null,
};

const modal = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<OpenModalPayload>) => {
      state.modalType = action.payload.modalType;
      state.modalData = { ...state.modalData, ...(action.payload.modalData || {}) };
    },
    closeModal: (state) => {
      state.modalType = '';
      state.modalData = null;
    },
    updateModalData: (state, action: PayloadAction<Record<string, any>>) => {
      state.modalData = { ...state.modalData, ...action.payload };
    }
  }
});

export const { openModal, closeModal, updateModalData } = modal.actions;

export default modal.reducer;