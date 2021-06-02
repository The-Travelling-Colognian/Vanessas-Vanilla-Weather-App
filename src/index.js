let apiKey = "592ec9fec843be6f39db84cfa93ed174";
let apiWeatherUrl = "api.openweathermap.org/data/2.5/weather";
let apiForecastUrl = "https://api.openweathermap.org/data/2.5/onecall";
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
function formatDate(timezone) {
  let time = new Date(timezone);
  // let localTimeOffset = time.getTimezoneOffset() * 60;
  // let UTC = time.setSeconds(time.getSeconds() + localTimeOffset);
  // time.setSeconds(time.getSeconds() + timezone);
  let hours = time.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = time.getMinutes();
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
  let day = days[time.getDay()];
  let date = time.getDate();
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
  let month = months[time.getMonth()];
  return `${day}, ${date} ${month}, ${hours}:${minutes}`;
}
let dateElement = document.querySelector("#current-date-time");
let now = new Date();
dateElement.innerHTML = formatDate(now);
function showSearchedCityWeather(response) {
  let currentTemp = document.querySelector("#current-temperature");
  currentTemp.innerHTML = Math.round(response.data.main.temp);
  //celciusTemperature = currentTemp.innerHTML;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = `Wind: ${Math.round(
    response.data.wind.speed * 3.6
  )} km/h`;
  let cityName = response.data.name;
  let countryCode = response.data.sys.country;
  let location = document.querySelector("#location-name");
  location.innerHTML = `${cityName}, ${countryCode}`;
  let weatherIcon = document.querySelector("#current-weather-icon");
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);
  let weatherDescription = document.querySelector(
    "#current-weather-description"
  );
  let weatherDescriptionValue = response.data.weather[0].description;
  weatherDescription.innerHTML = `${weatherDescriptionValue}`;
  axios
    .get(
      `${apiForecastUrl}?q=${cityName},${countryCode}&units=metric&appid=${apiKey}`
    )
    .then(displayForecast);
}
function formatHours(timezone, timestamp) {
  let time = new Date(timestamp);
  let localTimeOffset = time.getTimezoneOffset() * 60;
  let UTC = time.setSeconds(time.getSeconds() + localTimeOffset);
  time.setSeconds(time.getSeconds() + timezone);
  let hours = time.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
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
//Convert temperature units
let celciusTemperature = null;
function convertToFarenheit(event) {
  event.preventDefault();
  let temperatureValue = document.querySelector("#current-temperature");
  let farenheitTemperature = Math.round((celciusTemperature * 9) / 5 + 32);
  temperatureValue.innerHTML = farenheitTemperature;
  celciusButton.classList.remove("active");
  farenheitButton.classList.add("active");
}
function convertToCelcius(event) {
  event.preventDefault();
  let temperatureValue = document.querySelector("#current-temperature");
  temperatureValue.innerHTML = celciusTemperature;
  farenheitButton.classList.remove("active");
  celciusButton.classList.add("active");
}
let farenheitButton = document.querySelector("#unit-fahrenheit");
farenheitButton.addEventListener("click", convertToFarenheit);
let celciusButton = document.querySelector("#unit-celsius");
celciusButton.addEventListener("click", convertToCelcius);
//Initial load
axios
  .get(
    `https://api.openweathermap.org/data/2.5/weather?q=cologne,de&units=metric&appid=${apiKey}`
  )
  .then(showSearchedCityWeather);
