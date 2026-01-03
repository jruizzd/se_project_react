import { useContext } from "react";
import ItemCard from "../ItemCard/ItemCard";
import "../ClothesSection/ClothesSection.css";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ClothesSection({
  clothingItems,
  handleCardClick,
  handleAddClick,
  onCardLike, //  Accept the likes handler
}) {
  const currentUser = useContext(CurrentUserContext);

  // Only show items owned by current user
  const userClothingItems = clothingItems.filter(
    (item) => item.owner === currentUser?._id
  );

  return (
    <div className="clothes-section">
      <div className="clothes-section__add">
        <p>Your items</p>
        <button
          className="clothes-section__add-button"
          type="button"
          onClick={handleAddClick}
        >
          + Add New
        </button>
      </div>

      <ul className="clothes-section__items">
        {userClothingItems.map((item) => (
          <ItemCard
            key={item._id}
            item={item}
            onCardClick={handleCardClick}
            onCardLike={onCardLike} //  Forward the handler
          />
        ))}
      </ul>
    </div>
  );
}

export default ClothesSection;
