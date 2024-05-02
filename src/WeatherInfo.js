
function CurrentWeather({ weather }) {
  return (
    <div>
      <p> Conditions: {weather.conditions + " " + Math.round(weather.temperature * (9 / 5) + 32) + '\u00B0F'}</p>
      <p>Date: {weather.date}</p>
      <p> Description: {weather.description} </p>
      <p> Wind: {weather.wind + 'mph'} </p>
      <p> Rain: {Math.round(weather.rain) + "% chance rain"} </p>
    </div>
  );
}

export default CurrentWeather;
