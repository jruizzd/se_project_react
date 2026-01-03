import { useState, useContext } from "react";
import ClothesSection from "../ClothesSection/ClothesSection";
import SideBar from "../SideBar/SideBar";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import api from "../../utils/api";
import "./Profile.css";

function Profile({
  clothingItems,
  handleCardClick,
  handleAddClick,
  onCardLike, // ✅ Likes handler from App
  onLogout, // ✅ Logout handler from App
  onUserUpdate, // ✅ Handler to update current user context after profile edit
}) {
  const currentUser = useContext(CurrentUserContext);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  /* -------------------- Handlers -------------------- */
  const handleEditProfileClick = () => setIsEditProfileOpen(true);
  const closeAllModals = () => setIsEditProfileOpen(false);

  // Update user profile
  const handleUpdateUser = ({ name, avatar }) => {
    const token = localStorage.getItem("jwt");

    api
      .updateUserProfile({ name, avatar }, token)
      .then((updatedUser) => {
        // ✅ Update context so UI updates immediately
        if (onUserUpdate) onUserUpdate(updatedUser);
        closeAllModals();
      })
      .catch((err) => console.error("Failed to update profile:", err));
  };

  return (
    <div className="profile">
      {/* Sidebar */}
      <section className="profile__sidebar">
        <SideBar onEditProfile={handleEditProfileClick} onLogout={onLogout} />
      </section>

      {/* Clothing Items */}
      <section className="profile__clothing-items">
        <ClothesSection
          clothingItems={clothingItems}
          handleCardClick={handleCardClick}
          handleAddClick={handleAddClick}
          onCardLike={onCardLike} // ✅ Pass down likes handler
        />
      </section>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={closeAllModals}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  );
}

export default Profile;
