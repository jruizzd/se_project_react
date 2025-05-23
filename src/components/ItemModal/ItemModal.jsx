import closeIcon from "../../assets/close-menu.svg";
import "./ItemModal.css";

function ItemModal({ activeModal, onClose, card, onDelete }) {
  const handleDeleteClick = () => {
    onDelete(card._id); // Call onDelete with the card's id
    onClose(); // Close the modal after deletion
  };

  return (
    <div className={`modal ${activeModal === "preview" && "modal_opened"}`}>
      <div className="modal__content modal__content_type_image">
        <img
          src={closeIcon}
          alt="Close modal"
          className="modal__close"
          onClick={onClose}
        />
        <img
          src={card.link}
          alt={card.name || "Weather clothing item"}
          className="modal__image"
        />
        <div className="modal__footer">
          <h2 className="modal__caption">{card.name}</h2>
          <p className="modal__weather">Weather : {card.weather}</p>
          <button className="modal__delete-button" onClick={handleDeleteClick}>
            Delete item
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
