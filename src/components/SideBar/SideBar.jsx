import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import defaultAvatar from "../../assets/avatar.png";
import "./SideBar.css";

function SideBar({ onEditProfile, onLogout }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <div className="sidebar">
      {/* User Avatar */}
      <img
        className="sidebar__avatar"
        src={currentUser?.avatar || defaultAvatar}
        alt="User avatar"
      />

      {/* User Name */}
      <p className="sidebar__username">{currentUser?.name || "User"}</p>

      {/* Edit Profile Button */}
      <button
        type="button"
        className="sidebar__edit-button"
        onClick={onEditProfile}
      >
        Edit Profile
      </button>

      {/* Logout Button */}
      <button
        type="button"
        className="sidebar__logout-button"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default SideBar;
