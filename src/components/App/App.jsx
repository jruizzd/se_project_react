import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { coordinates, APIkey } from "../../utils/constants";
import Header from "../Header/Header";
import Main from "../Main/Main";
import ItemModal from "../ItemModal/ItemModal";
import Profile from "../Profile/Profile";
import Footer from "../Footer/Footer";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import AddItemModal from "../AddItemModal/AddItemModal";
import { getItems, deleteItem } from "../../utils/api";

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

  //invalid!!! Will not work
  //activeModal = "somethine else";

  //the correct way to update to change a state variable
  //setActiveModal("something else")

  // let message = "hello";
  // message = "goodbye";

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

  const handleAddItemModalSubmit = ({ name, imageUrl, weather }) => {
    setClothingItems((prevItems) => [
      { name, imageUrl, weather },
      ...prevItems,
    ]);
    closeActiveModal();
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
      .catch(console.error);
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
        {activeModal === "confirm-delete" && (
          <div className="modal modal_opened">
            <div className="modal__content">
              <p>Are you sure you want to delete this item?</p>
              <div className="modal__buttons">
                <button onClick={handleDeleteItem}>Yes</button>
                <button onClick={closeActiveModal}>No</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CurrentTemperatureUnitContext.Provider>
  );
}

export default App;
