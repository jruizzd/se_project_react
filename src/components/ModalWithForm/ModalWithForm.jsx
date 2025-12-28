import closeIcon from "../../assets/close-menu.svg";
import "./ModalWithForm.css";

function ModalWithForm({
  children,
  title,
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
}) {
  return (
    <div className={`modal ${isOpen ? "modal_opened" : ""}`}>
      <div className="modal__content">
        <h2 className="modal__title">{title}</h2>
        <img
          src={closeIcon}
          alt="Close modal"
          className="modal__close"
          onClick={onClose}
        />
        <form onSubmit={onSubmit} className="modal__form">
          {children}
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
