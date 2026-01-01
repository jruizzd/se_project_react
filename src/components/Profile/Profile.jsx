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
  onLogout, // ✅ received from App
}) {
  const currentUser = useContext(CurrentUserContext);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const handleEditProfileClick = () => {
    setIsEditProfileOpen(true);
  };

  const closeAllModals = () => {
    setIsEditProfileOpen(false);
  };

  const handleUpdateUser = ({ name, avatar }) => {
    const token = localStorage.getItem("jwt");

    api
      .updateUserProfile({ name, avatar }, token)
      .then(() => {
        closeAllModals();
      })
      .catch((err) => {
        console.error("Failed to update profile:", err);
      });
  };

  return (
    <div className="profile">
      {/* Sidebar */}
      <section className="profile__sidebar">
        <SideBar
          onEditProfile={handleEditProfileClick}
          onLogout={onLogout} // ✅ pass to sidebar if button lives there
        />

        {/* OR sign-out button here */}
        <button
          type="button"
          className="profile__signout"
          onClick={onLogout} // ✅ TASK 5 COMPLETE
        >
          Sign out
        </button>
      </section>

      {/* Clothing Items */}
      <section className="profile__clothing-items">
        <ClothesSection
          clothingItems={clothingItems}
          handleCardClick={handleCardClick}
          handleAddClick={handleAddClick}
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
