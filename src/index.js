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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
      <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
      <img
        src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png"
        alt=""
        width="42"
        />
        <div class="weather-forecast-temperatures">
        <span class="weather-forecast-temperature-max"> ${Math.round(
          forecastDay.temp.max
        )}° </span>
        <span class="weather-forecast-temperature-min"> ${Math.round(
          forecastDay.temp.min
        )}° </span>
        </div>
        </div>
      `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "592ec9fec843be6f39db84cfa93ed174";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showSearchedCityWeather(response) {
  let currentTemp = document.querySelector("#current-temperature");
  currentTemp.innerHTML = Math.round(response.data.main.temp);
  celsiusTemperature = response.data.main.temp;
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

  getForecast(response.data.coord);
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

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temperature");

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

//Initial load
axios
  .get(
    `https://api.openweathermap.org/data/2.5/weather?q=cologne,de&units=metric&appid=${apiKey}`
  )
  .then(showSearchedCityWeather);
