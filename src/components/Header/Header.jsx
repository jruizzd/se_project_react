import hamburgerIcon from "../../assets/hamburger-menu.svg";
import closeIcon from "../../assets/close-menu.svg";
import "./Header.css";
import logo from "../../assets/logo.svg";
import avatar from "../../assets/avatar.png";
import { useState } from "react";

function Header({ handleAddClick, weatherData }) {
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);

  const handleMobileMenuClick = () => {
    setIsMobileMenuOpened(!isMobileMenuOpened);
  };
  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });
  return (
    <header className="header">
      <div className="header__logo-container">
        <img className="header__logo" src={logo} />
        <p className="header__date-and-location">
          {currentDate}, {weatherData.city}
        </p>
      </div>
      <button className="header__menu-button" onClick={handleMobileMenuClick}>
        <img src={hamburgerIcon} alt={"Open menu"} />
      </button>
      <nav
        className={`header__nav ${
          isMobileMenuOpened ? "header__nav_opened" : ""
        }`}
      >
        <button className="header__menu-button" onClick={handleMobileMenuClick}>
          <img src={closeIcon} alt={"Close menu"} />
        </button>
        <button
          onClick={handleAddClick}
          type="button"
          className="header__add-clothes-btn"
        >
          + Add clothes
        </button>
        <div className="header__user-container">
          <p className="header__username">Terrence Tegegne</p>
          <img src={avatar} alt="Terrence Tegegne" className="header__avatar" />
        </div>
      </nav>
    </header>
  );
}

export default Header;
