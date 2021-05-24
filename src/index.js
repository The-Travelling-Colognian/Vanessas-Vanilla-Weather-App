let apiKey = "592ec9fec843be6f39db84cfa93ed174";
let apiWeatherUrl = "api.openweathermap.org/data/2.5/weather";
let units = "metric";
function searchCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  let cityNameLowerCase = searchInput.value.toLowerCase();
  if (cityNameLowerCase === "cologne") {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=cologne,au&units=metric&appid=592ec9fec843be6f39db84cfa93ed174`
      )
      .then(showSearchedCityWeather);
  } else if (cityNameLowerCase) {
    axios
      .get(
        `https://${apiWeatherUrl}?q=${cityNameLowerCase}&units=${units}&appid=${apiKey}`
      )
      .then(showSearchedCityWeather);
  }
}
function formatDate() {
  let now = new Date();
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let date = now.getDate();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];
  return `${day}, ${date} ${month}, ${hours}:${minutes}`;
}
let dateElement = document.querySelector("#current-date-time");
dateElement.innerHTML = formatDate();
function showSearchedCityWeather(response) {
  let currentTemp = document.querySelector("#current-temperature");
  currentTemp.innerHTML = Math.round(response.data.main.temp);
  //celciusTemperature = currentTemp.innerHTML;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `💦Humidity: ${response.data.main.humidity}%`;
  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = `💨Wind: ${Math.round(
    response.data.wind.speed * 3.6
  )} km/h`;
  let cityName = response.data.name;
  let countryCode = response.data.sys.country;
  let location = document.querySelector("#location-name");
  location.innerHTML = `${cityName}, ${countryCode}`;
  let weatherDescription = document.querySelector(
    "#current-weather-description"
  );
  let weatherDescriptionValue = response.data.weather[0].description;
  weatherDescription.innerHTML = `${weatherDescriptionValue}`;
}
function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(latitude, longitude);
  axios
    .get(
      `https://${apiWeatherUrl}?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`
    )
    .then(showSearchedCityWeather);
}
function currentLocationSearch(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
let form = document.querySelector("form");
form.addEventListener("submit", searchCity);
let currentLocationButton = document.querySelector("#location-button");
currentLocationButton.addEventListener("click", currentLocationSearch);
