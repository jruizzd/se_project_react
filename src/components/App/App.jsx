// React imports
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

// styles
import "./App.css";

// Components
import Header from "../Header/Header";
import Main from "../Main/Main";
import ItemModal from "../ItemModal/ItemModal";
import Profile from "../Profile/Profile";
import Footer from "../Footer/Footer";
import AddItemModal from "../AddItemModal/AddItemModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";

// Contexts
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";

// Utils/API/Constants
import { coordinates, APIkey } from "../../utils/constants";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import { getItems, deleteItem, addItem } from "../../utils/api";

function App() {
  //creating state variables
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999, C: 999 },
    city: "",
    condition: "",
    isDay: true,
  });
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [clothingItems, setClothingItems] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  const handleAddItemModalSubmit = async (newItem) => {
    try {
      // Send to server first
      const savedItem = await addItem(newItem);

      // Then update local state with the server response
      setClothingItems([...clothingItems, savedItem]);

      // Close modal
      closeActiveModal();
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  // Add it here, before handleDeleteItem
  const openConfirmationModal = (card) => {
    setItemToDelete(card);
    setActiveModal("confirm-delete");
  };

  // Add the handleDeleteItem function here
  const handleDeleteItem = async () => {
    try {
      await deleteItem(itemToDelete._id);
      setClothingItems(
        clothingItems.filter((item) => item._id !== itemToDelete._id)
      );
      setItemToDelete(null);
      closeActiveModal();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    getItems()
      .then((data) => {
        setClothingItems(data);
      })
      .catch((err) => {
        console.error("Failed to fetch clothing items:", err);
      });
  }, []);

  return (
    <CurrentTemperatureUnitContext.Provider
      value={{ currentTemperatureUnit, handleToggleSwitchChange }}
    >
      <div className="page">
        <div className="page__content">
          <Header handleAddClick={handleAddClick} weatherData={weatherData} />
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  weatherData={weatherData}
                  handleCardClick={handleCardClick}
                  clothingItems={clothingItems}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  clothingItems={clothingItems}
                  handleCardClick={handleCardClick}
                  handleAddClick={handleAddClick}
                />
              }
            />
          </Routes>
        </div>
        <Footer />
        <AddItemModal
          isOpen={activeModal === "add-garment"}
          onClose={closeActiveModal}
          onAddItemModalSubmit={handleAddItemModalSubmit}
        />
        <ItemModal
          activeModal={activeModal}
          card={selectedCard}
          onClose={closeActiveModal}
          onDelete={openConfirmationModal}
        />
        <ConfirmDeleteModal
          isOpen={activeModal === "confirm-delete"}
          onConfirm={handleDeleteItem}
          onCloseModal={closeActiveModal}
          itemName={itemToDelete?.name}
        />
      </div>
    </CurrentTemperatureUnitContext.Provider>
  );
}

export default App;
