import ModalWithForm from "../ModalWithForm/ModalWithForm";

const ConfirmDeleteModal = ({ isOpen, onConfirm, onCloseModal, itemName }) => {
  const handleConfirm = () => {
    onConfirm();
    onCloseModal();
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      onCloseModal={onCloseModal}
      title="Delete Item"
    >
      <p>Are you sure you want to delete "{itemName}"?</p>
      <div className="modal__buttons">
        <button onClick={handleConfirm} className="modal__confirm-btn">
          Yes, Delete
        </button>
        <button onClick={onCloseModal} className="modal__cancel-btn">
          Cancel
        </button>
      </div>
    </ModalWithForm>
  );
};

export default ConfirmDeleteModal;
