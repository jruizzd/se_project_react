import ClothesSection from "../ClothesSection/ClothesSection";
import SideBar from "../SideBar/SideBar";
import "./Profile.css";

// Profile Component (The Main Room)
// This is like the entire closet room

function Profile({ clothingItems, handleCardClick }) {
  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar />
      </section>
      <section className="profile__clothing-items">
        <ClothesSection
          clothingItems={clothingItems}
          handleCardClick={handleCardClick}
        />
      </section>
    </div>
  );
}
export default Profile;
