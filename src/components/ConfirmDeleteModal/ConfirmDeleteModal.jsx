import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./ConfirmDeleteModal.css";

const ConfirmDeleteModal = ({ isOpen, onConfirm, onCloseModal, itemName }) => {
  const handleConfirm = () => {
    onConfirm();
    onCloseModal();
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={onCloseModal}
      title={
        "Are you sure you want to delete this item? This action is " +
        'irreversible. "' +
        itemName +
        '"?'
      }
    >
      <div className="modal__confirm-content">
        <div className="modal__buttons">
          <button type="submit" className="modal__confirm-btn">
            Yes, delete item
          </button>
          <button onClick={onCloseModal} className="modal__cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </ModalWithForm>
  );
};

export default ConfirmDeleteModal;
