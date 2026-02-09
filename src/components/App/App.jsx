import { useEffect, useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";

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
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

// Contexts
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import CurrentUserContext from "../../contexts/CurrentUserContext";

// Utils / API
import { coordinates, apiKey } from "../../utils/constants";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [activeModal, setActiveModal] = useState("");
  const [authModal, setAuthModal] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  /* -------------------- MODAL HELPERS -------------------- */
  const openLogin = () => setAuthModal("login");
  const openRegister = () => setAuthModal("register");

  const handleSwitchToRegister = () => {
    setAuthModal("register");
  };

  const closeAllModals = useCallback(() => {
    setActiveModal("");
    setAuthModal("");
    setSelectedCard(null);
    setItemToDelete(null);
  }, []);

  /* -------------------- UI HANDLERS -------------------- */
  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit((prev) => (prev === "F" ? "C" : "F"));
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setActiveModal("preview");
  };

  const handleAddClick = () => setActiveModal("add-garment");

  /* -------------------- ITEM CRUD -------------------- */
  const handleAddItemSubmit = (newItem) => {
    const token = localStorage.getItem("jwt");

    return apiAddItem(newItem, token)
      .then((res) => {
        setClothingItems((prev) => [...prev, res.data]);
        closeAllModals();
        return res;
      })
      .catch((err) => {
        console.error("Add item failed:", err);
        throw err;
      });
  };

  const openDeleteConfirmation = (item) => {
    setItemToDelete(item);
    setActiveModal("confirm-delete");
  };

  const handleDeleteItem = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");

    return apiDeleteItem(itemToDelete._id, token)
      .then(() => {
        setClothingItems((prev) =>
          prev.filter((item) => item._id !== itemToDelete._id),
        );
        closeAllModals();
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        throw err;
      });
  };

  /* -------------------- LIKES -------------------- */
  const handleCardLike = ({ _id, isLiked }) => {
    const token = localStorage.getItem("jwt");

    const request = isLiked
      ? removeCardLike(_id, token)
      : addCardLike(_id, token);

    return request
      .then((newCard) => {
        setClothingItems((cards) =>
          cards.map((item) => (item._id === _id ? newCard.data : item)),
        );
        return newCard;
      })
      .catch((err) => {
        console.error("Like error:", err);
        throw err;
      });
  };

  /* -------------------- AUTH -------------------- */
  const handleRegister = (userData) => {
    return signup(userData)
      .then(() =>
        handleLogin({
          email: userData.email,
          password: userData.password,
        }),
      )
      .catch((err) => {
        console.error("Registration error:", err);
        throw err;
      });
  };

  const handleLogin = (credentials) => {
    return signin(credentials)
      .then((data) => {
        if (!data.token) {
          throw new Error("No token returned");
        }
        localStorage.setItem("jwt", data.token);
        return fetchUser(data.token);
      })
      .then(() => {
        closeAllModals();
      })
      .catch((err) => {
        console.error("Login error:", err);
        throw err;
      });
  };

  const fetchUser = (token) => {
    return checkToken(token)
      .then((userData) => {
        setCurrentUser(userData);
        setIsLoggedIn(true);
        return userData;
      })
      .catch((err) => {
        console.error("Token invalid:", err);
        handleLogout();
        throw err;
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  /* -------------------- EFFECTS -------------------- */
  useEffect(() => {
    getWeather(coordinates, apiKey)
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

  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        closeAllModals();
      }
    };

    document.addEventListener("keydown", closeByEscape);
    return () => document.removeEventListener("keydown", closeByEscape);
  }, [closeAllModals]);

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
              onLoginClick={openLogin}
              onRegisterClick={openRegister}
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
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Profile
                      clothingItems={clothingItems}
                      handleCardClick={handleCardClick}
                      handleAddClick={handleAddClick}
                      onCardLike={handleCardLike}
                      onLogout={handleLogout}
                    />
                  </ProtectedRoute>
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
            onSwitchToLogin={openLogin}
          />

          <LoginModal
            isOpen={authModal === "login"}
            onClose={closeAllModals}
            onLogin={handleLogin}
            onSwitchToRegister={handleSwitchToRegister}
          />
        </div>
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
