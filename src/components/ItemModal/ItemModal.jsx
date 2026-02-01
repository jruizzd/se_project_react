import { useContext } from "react";
import closeIcon from "../../assets/close-menu.svg";
import "./ItemModal.css";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemModal({ activeModal, onClose, card, onDelete }) {
  const currentUser = useContext(CurrentUserContext);

  const isOwn =
    Boolean(currentUser?._id) &&
    Boolean(card?.owner) &&
    card.owner === currentUser._id;

  const handleDeleteClick = () => {
    onDelete(card);
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
          src={card?.imageUrl}
          alt={card?.name || "Weather clothing item"}
          className="modal__image"
        />

        <div className="modal__footer">
          <div className="modal__text-container">
            <h2 className="modal__caption">{card?.name}</h2>
            <p className="modal__weather">Weather: {card?.weather}</p>
          </div>

          {isOwn && (
            <button
              className="modal__delete-button"
              type="button"
              onClick={handleDeleteClick}
            >
              Delete item
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
