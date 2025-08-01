// SideBar Component (The Mirror Section)
// Like a mirror area where you see your basic information

import avatar from "../../assets/avatar.png";
import "./SideBar.css";

function SideBar() {
  return (
    <div className="sidebar">
      <img className="sidebar__avatar" src={avatar} alt="avatar" />
      <p className="sidebar__username">Terrence Tegegne</p>
    </div>
  );
}
export default SideBar;
