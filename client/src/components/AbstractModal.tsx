// AbstractModal.tsx
import React from "react";
import { Modal } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";

interface ModalState {
  modalType: "create" | "edit" | "link" | "";
}

interface RootState {
  modal: ModalState;
}

interface AbstractModalProps {
  show: boolean;
  handleClose: () => void;
  Component: React.ReactElement;
  editComponent: React.ReactElement;
  heading?: string;
}

const AbstractModal: React.FC<AbstractModalProps> = ({
  show,
  handleClose,
  Component,
  editComponent,
  heading,
}) => {
  const { modalType } = useSelector((state: RootState) => state.modal);

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Modal.Title>
            {/* Uncomment and modify as needed */}
            {/* {modalType === "second"
              ? heading
              : `${modalType === "edit" ? "Edit" : "Add"} ${heading}`} */}
            {modalType === "edit" ? "Edit" : modalType === "create" ? "Add" : ""}
            {heading && ` ${heading}`}
          </Modal.Title>
          <CloseIcon
            onClick={handleClose}
            style={{ cursor: "pointer", marginLeft: "auto" }}
          />
        </Modal.Header>
        <Modal.Body>
          {modalType === "edit"
            ? editComponent
            : modalType === "create"
            ? Component
            : modalType === "link"
            ? Component
            : ""}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AbstractModal;