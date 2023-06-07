const API_KEY = "4c9b53e4f8f5eb00df5915bdca340605";

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

function changeCity(event) {
  event.preventDefault();
  let inputElement = document.querySelector("#DataList");
  let newCity = inputElement.value;
  inputElement.value = null; // Clear the input field
  inputElement.blur(); // Unfocus the input field
  //if My location was selected then run navigator
  if (newCity === "Current location") {
    navigator.geolocation.getCurrentPosition(handlePosition);
  } else {
    let _apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${API_KEY}&&units=metric`;
    axios.get(_apiUrl).then(updateData);
  }
}

function handlePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  retrieveDatafromApi(lat, lon);
}

function retrieveDatafromApi(lat, lon) {
  let _apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&&units=metric`;
  axios.get(_apiUrl).then(updateData);
}

function updateData(response) {
  //update h1 with city name
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.name;
  //update temperatures
  let mainTemp = document.querySelector("#mainTemp");
  let minTemp = document.querySelector(".min-temp");
  let maxTemp = document.querySelector(".max-temp");
  mainTemp.innerHTML = Math.round(response.data.main.temp);
  minTemp.innerHTML = Math.round(response.data.main.temp_min);
  maxTemp.innerHTML = Math.round(response.data.main.temp_max);

  //update humidity and Wind
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  humidity.innerHTML = `${Math.round(response.data.main.humidity)}`;
  wind.innerHTML = `${Math.round(response.data.wind.speed)}`;

  //update weather sentence
  let sentenceWeather = document.querySelector(".sentence-weather");
  sentenceWeather.innerHTML = capitaliseFirstLetter(
    response.data.weather[0].description
  );
}

//update block to today's date
let todayDate = document.querySelector("#today-date");
todayDate.innerHTML = changeTodayDate();

//fetch current city & temperature
navigator.geolocation.getCurrentPosition(handlePosition);

//update city to submitted city
let formElement = document.querySelector("#input-form");
formElement.addEventListener("submit", changeCity);

//sort the celcius/farehnheit links
let colorCelsius = document.querySelector(".units .celsius");
let colorFahrenheit = document.querySelector(".units .fahrenheit");
colorCelsius.addEventListener("click", changeUnitsToCelsius);
colorFahrenheit.addEventListener("click", changeUnitsToFahrenheit);
