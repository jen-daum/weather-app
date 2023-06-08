const API_URL = "https://api.shecodes.io/weather/v1/";
const API_KEY = "ot351f8facfc3d0f699be8054cb84374";

//update celsius/fahrenheit value and color depending on choice
function changeUnitsToFahrenheit(event) {
  event.preventDefault();
  let mainTemp = document.querySelector(".main-temp");
  let colorCelsius = document.querySelector(".units .celsius");
  let colorFahrenheit = document.querySelector(".units .fahrenheit");
  colorCelsius.classList.remove("lightened-units");
  colorCelsius.classList.add("darkened-units");
  colorFahrenheit.classList.remove("darkened-units");
  colorFahrenheit.classList.add("lightened-units");
}

function changeUnitsToCelsius(event) {
  event.preventDefault();
  let mainTemp = document.querySelector(".main-temp");
  let colorCelsius = document.querySelector(".units .celsius");
  let colorFahrenheit = document.querySelector(".units .fahrenheit");
  colorCelsius.classList.remove("darkened-units");
  colorCelsius.classList.add("lightened-units");
  colorFahrenheit.classList.remove("lightened-units");
  colorFahrenheit.classList.add("darkened-units");
}

function changeTodayDate() {
  let now = new Date();
  let day = now.getDay();
  let fullDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let fullDate = `${fullDays[now.getDay()]} ${now.getHours()}:${(
    "0" + now.getMinutes()
  ).slice(-2)}`;
  //using this slice method to have leading 0 when minutes <10
  return fullDate;
}

function capitaliseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function fetchCity(event) {
  event.preventDefault();
  let inputElement = document.querySelector("#DataList");
  let newCity = inputElement.value;
  inputElement.value = null; // Clear the input field
  inputElement.blur(); // Unfocus the input field
  fetchCityStats(newCity);
}

function fetchCityStats(city) {
  //if My location was selected then run navigator
  if (city === "Current location") {
    navigator.geolocation.getCurrentPosition(handlePosition);
  } else {
    let _apiUrl = `${API_URL}forecast?query=${city}&key=${API_KEY}&units=metric`;
    axios.get(_apiUrl).then(updateData);
  }
}

function handlePosition(position) {
  let lat = position.coordinates.latitude;
  let lon = position.coordinates.longitude;
  retrieveDatafromApi(lat, lon);
}

function retrieveDatafromApi(lat, lon) {
  let _apiUrl = `${API_URL}forecast?lon=${lon}&lat=${lat}&key=${API_KEY}&units=metric`;
  axios.get(_apiUrl).then(updateData);
}

function updateData(response) {
  //update h1 with city name
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.city;
  //update temperatures
  let mainTemp = document.querySelector("#mainTemp");
  let minTemp = document.querySelector(".min-temp");
  let maxTemp = document.querySelector(".max-temp");
  mainTemp.innerHTML = Math.round(response.data.daily[1].temperature.day);
  minTemp.innerHTML = Math.round(response.data.daily[1].temperature.minimum);
  maxTemp.innerHTML = Math.round(response.data.daily[1].temperature.maximum);

  //update humidity and Wind
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  humidity.innerHTML = `${Math.round(
    response.data.daily[1].temperature.humidity
  )}`;
  wind.innerHTML = `${Math.round(response.data.daily[1].wind.speed)}`;

  //update weather sentence
  let sentenceWeather = document.querySelector(".sentence-weather");
  sentenceWeather.innerHTML = capitaliseFirstLetter(
    response.data.weather[0].description
  );
}

//update block to today's date
let todayDate = document.querySelector("#today-date");
todayDate.innerHTML = changeTodayDate();

//default page to specific city first while waiting for the user input
let defaultCity = "Marseille";
fetchCityStats(defaultCity);

//update city to submitted city
let formElement = document.querySelector("#input-form");
formElement.addEventListener("submit", fetchCity);

//sort the celcius/farehnheit links
let colorCelsius = document.querySelector(".units .celsius");
let colorFahrenheit = document.querySelector(".units .fahrenheit");
colorCelsius.addEventListener("click", changeUnitsToCelsius);
colorFahrenheit.addEventListener("click", changeUnitsToFahrenheit);

/* const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const now = new Date(); // Get the current date and time
const tomorrow = new Date(now); // create a new Date object with the same value as now (it is temporary)
tomorrow.setDate(now.getDate() + 1); // Set the date to tomorrow

const tomorrowIndex = tomorrow.getDay(); // Get the day index (0-6) for tomorrow which should say 4
const day = days[tomorrowIndex]; // Retrieve the corresponding day from the `days` array, 4 in the Array is Friday */
