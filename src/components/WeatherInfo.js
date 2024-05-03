import '../styles/Styles.css';

import sunnyImage from '../assets/sunny.png';
import cloudyImage from '../assets/cloudy.png';
import rainyImage from '../assets/rainy.png';
import windyImage from '../assets/windy.png';

// Child component for processing daily weather information and sending it back to parent component (Weather)
function WeatherInfo({ weather }) {
  return (
    <div class="weather-container">
      <div class="weather-icon">
        {weather.conditions && (
          <p>
            {(() => {
              const condition = weather.conditions.split(',')[0].toLowerCase().trim();
              if (condition.includes('sunny') || condition.includes('clear')) {
                return <img src={sunnyImage} alt="Sun" width="115" height="115" />;
              }
              if (condition.includes('cloudy') || condition.includes('overcast')) {
                return <img src={cloudyImage} alt="Cloud" width="115" height="115" />;
              }
              if (condition.includes('rain')) {
                return <img src={rainyImage} alt="Rain" width="115" height="115" />;
              }
            })()}
          </p>
        )}
      </div>
      <div class="weather-text">
        <p> {weather.conditions + " " + Math.round(weather.temperature) + '\u00B0F'} </p>
        <div class="text-image-inline">
          <img src={windyImage} alt="wind" height="25" width="25" class="inline-image"></img>
          <p class="inline-text"> {'wind ' + weather.wind + 'mph'} </p>
        </div>
        <div class="text-image-inline">
          <img src={rainyImage} alt="rain" height="25" width="25" class="inline-image"></img>
          <p class="inline-text"> {Math.round(weather.rain) + "% chance rain"} </p>
        </div>
      </div>
    </div>
  );
}

export default WeatherInfo;
