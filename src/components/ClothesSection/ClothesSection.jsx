//ClothesSection Component (The Storage Area)
// Like the main closet space where all your clothes are displayed
import ItemCard from "../ItemCard/ItemCard";
import "../ClothesSection/ClothesSection.css";

function ClothesSection({ clothingItems, handleCardClick }) {
  return (
    <div className="clothes-section">
      <div>
        <p>Your items</p>
        <button>+ Add New</button>
      </div>
      <ul className="clothes-section__items">
        {clothingItems.map((item) => {
          return (
            <ItemCard
              key={item._id}
              item={item}
              onCardClick={handleCardClick}
            />
          );
        })}
      </ul>
    </div>
  );
}
export default ClothesSection;
