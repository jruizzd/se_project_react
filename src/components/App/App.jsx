// React
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Styles
import "./App.css";

// Components
import Header from "../Header/Header";
import Main from "../Main/Main";
import Profile from "../Profile/Profile";
import Footer from "../Footer/Footer";

import ItemModal from "../ItemModal/ItemModal";
import AddItemModal from "../AddItemModal/AddItemModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal";

// Contexts
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import CurrentUserContext from "../../contexts/CurrentUserContext";

// Utils / API
import { coordinates, APIkey } from "../../utils/constants";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import {
  getItems,
  addItem as apiAddItem,
  deleteItem as apiDeleteItem,
  addCardLike,
  removeCardLike,
} from "../../utils/api";
import { signup, signin, checkToken } from "../../utils/auth";

function App() {
  /* -------------------- STATE -------------------- */

  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999, C: 999 },
    city: "",
    condition: "",
    isDay: true,
  });

  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [clothingItems, setClothingItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [activeModal, setActiveModal] = useState("");
  const [authModal, setAuthModal] = useState("");

  const [selectedCard, setSelectedCard] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* -------------------- UI HANDLERS -------------------- */

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit((prev) => (prev === "F" ? "C" : "F"));
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setActiveModal("preview");
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const closeAllModals = () => {
    setActiveModal("");
    setAuthModal("");
    setSelectedCard(null);
    setItemToDelete(null);
  };

  /* -------------------- ITEM CRUD -------------------- */

  const handleAddItemSubmit = async (newItem) => {
    try {
      const token = localStorage.getItem("jwt");
      const savedItem = await apiAddItem(newItem, token);
      setClothingItems((prev) => [...prev, savedItem]);
      closeAllModals();
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const openDeleteConfirmation = (item) => {
    setItemToDelete(item);
    setActiveModal("confirm-delete");
  };

  const handleDeleteItem = async () => {
    try {
      const token = localStorage.getItem("jwt");
      await apiDeleteItem(itemToDelete._id, token);
      setClothingItems((prev) =>
        prev.filter((item) => item._id !== itemToDelete._id)
      );
      closeAllModals();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* -------------------- LIKES -------------------- */

  const handleCardLike = ({ _id, isLiked }) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    if (!isLiked) {
      addCardLike(_id, token)
        .then((updatedCard) => {
          setClothingItems((items) =>
            items.map((item) => (item._id === _id ? updatedCard : item))
          );
        })
        .catch(console.error);
    } else {
      removeCardLike(_id, token)
        .then((updatedCard) => {
          setClothingItems((items) =>
            items.map((item) => (item._id === _id ? updatedCard : item))
          );
        })
        .catch(console.error);
    }
  };

  /* -------------------- AUTH -------------------- */

  const handleRegister = async (userData) => {
    try {
      await signup(userData);
      await handleLogin({
        email: userData.email,
        password: userData.password,
      });
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const data = await signin(credentials);
      if (data.token) {
        localStorage.setItem("jwt", data.token);
        await fetchUser(data.token);
        closeAllModals();
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const fetchUser = async (token) => {
    try {
      const userData = await checkToken(token);
      setCurrentUser(userData);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Token invalid:", err);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  /* -------------------- EFFECTS -------------------- */

  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => setWeatherData(filterWeatherData(data)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    getItems()
      .then((res) => setClothingItems(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) fetchUser(token);
  }, []);

  /* -------------------- RENDER -------------------- */

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <div className="page">
          <div className="page__content">
            <Header
              weatherData={weatherData}
              handleAddClick={handleAddClick}
              onLoginClick={() => setAuthModal("login")}
              onRegisterClick={() => setAuthModal("register")}
              onLogoutClick={handleLogout}
            />

            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    weatherData={weatherData}
                    clothingItems={clothingItems}
                    handleCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                  />
                }
              />

              <Route
                path="/profile"
                element={
                  currentUser ? (
                    <Profile
                      clothingItems={clothingItems}
                      handleCardClick={handleCardClick}
                      handleAddClick={handleAddClick}
                      onCardLike={handleCardLike}
                      onLogout={handleLogout}
                    />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
            </Routes>
          </div>

          <Footer />

          {/* Modals */}
          <AddItemModal
            isOpen={activeModal === "add-garment"}
            onClose={closeAllModals}
            onAddItemModalSubmit={handleAddItemSubmit}
          />

          <ItemModal
            activeModal={activeModal}
            card={selectedCard}
            onClose={closeAllModals}
            onDelete={openDeleteConfirmation}
          />

          <ConfirmDeleteModal
            isOpen={activeModal === "confirm-delete"}
            onConfirm={handleDeleteItem}
            onCloseModal={closeAllModals}
            itemName={itemToDelete?.name}
          />

          <RegisterModal
            isOpen={authModal === "register"}
            onClose={closeAllModals}
            onRegister={handleRegister}
          />

          <LoginModal
            isOpen={authModal === "login"}
            onClose={closeAllModals}
            onLogin={handleLogin}
          />
        </div>
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
