import { useContext } from "react";
import ItemCard from "../ItemCard/ItemCard";
import "../ClothesSection/ClothesSection.css";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ClothesSection({ clothingItems, handleCardClick, handleAddClick }) {
  const currentUser = useContext(CurrentUserContext);

  // Filter items to only those owned by the current user
  const userClothingItems = clothingItems.filter(
    (item) => item.owner === currentUser?._id
  );

  return (
    <div className="clothes-section">
      <div className="clothes-section__add">
        <p>Your items</p>
        <button
          className="clothes-section__add-button"
          onClick={handleAddClick}
          type="button"
        >
          + Add New
        </button>
      </div>

      <ul className="clothes-section__items">
        {userClothingItems.map((item) => (
          <ItemCard key={item._id} item={item} onCardClick={handleCardClick} />
        ))}
      </ul>
    </div>
  );
}

export default ClothesSection;
