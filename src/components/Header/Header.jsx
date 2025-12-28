import { useState, useContext } from "react";
import { Link } from "react-router-dom";

import hamburgerIcon from "../../assets/hamburger-menu.svg";
import closeIcon from "../../assets/close-menu.svg";
import logo from "../../assets/logo.svg";

import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import CurrentUserContext from "../../contexts/CurrentUserContext";

import "./Header.css";

function Header({
  weatherData,
  handleAddClick,
  onLoginClick,
  onRegisterClick,
}) {
  const currentUser = useContext(CurrentUserContext);
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpened((prev) => !prev);
  };

  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  const firstLetter = currentUser?.name?.charAt(0).toUpperCase();

  return (
    <header className="header">
      <div className="header__logo-container">
        <Link to="/">
          <img className="header__logo" src={logo} alt="WTWR logo" />
        </Link>
        <p className="header__date-and-location">
          {currentDate}
          {weatherData?.city && `, ${weatherData.city}`}
        </p>
      </div>

      <button
        className="header__menu-button"
        onClick={toggleMobileMenu}
        aria-label="Open menu"
        aria-expanded={isMobileMenuOpened}
      >
        <img src={hamburgerIcon} alt="" />
      </button>

      <nav
        className={`header__nav ${
          isMobileMenuOpened ? "header__nav_opened" : ""
        }`}
      >
        <ToggleSwitch />

        <button
          className="header__menu-button"
          onClick={toggleMobileMenu}
          aria-label="Close menu"
        >
          <img src={closeIcon} alt="" />
        </button>

        {currentUser ? (
          <>
            <button
              type="button"
              className="header__add-clothes-btn"
              onClick={handleAddClick}
            >
              + Add clothes
            </button>

            <Link to="/profile" className="header__link">
              <div className="header__user-container">
                <p className="header__username">{currentUser.name}</p>

                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="header__avatar"
                  />
                ) : (
                  <div className="header__avatar-placeholder">
                    {firstLetter}
                  </div>
                )}
              </div>
            </Link>
          </>
        ) : (
          <div className="header__auth-buttons">
            <button className="header__auth-btn" onClick={onLoginClick}>
              Log in
            </button>
            <button className="header__auth-btn" onClick={onRegisterClick}>
              Sign up
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
