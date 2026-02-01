import "./Main.css";
import WeatherCard from "../WeatherCard/WeatherCard";
import ItemCard from "../ItemCard/ItemCard";
import { useContext } from "react";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";

function Main({ weatherData, handleCardClick, clothingItems, onCardLike }) {
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);

  const temperature = weatherData.temp[currentTemperatureUnit];

  const weatherType =
    temperature >= 75 ? "hot" : temperature >= 60 ? "warm" : "cold";

  const filteredClothingItems = clothingItems.filter(
    (item) => item.weather === weatherType,
  );

  return (
    <main>
      <WeatherCard weatherData={weatherData} />
      <section className="cards">
        <p className="cards__text">
          Today is {temperature}°{currentTemperatureUnit} / You may want to
          wear:
        </p>
        <ul className="cards__list">
          {filteredClothingItems.map((item) => (
            <ItemCard
              key={item._id}
              card={item}
              onCardClick={handleCardClick}
              onLikeClick={onCardLike}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;
