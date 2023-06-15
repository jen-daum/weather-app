const API_URL = "https://api.shecodes.io/weather/v1/";
const API_KEY = "ot351f8facfc3d0f699be8054cb84374";

//update celsius/fahrenheit value and color depending on choice
function changeUnitsToFahrenheit(event) {
  event.preventDefault();
  let colorCelsius = document.querySelector("#celsius");
  let colorFahrenheit = document.querySelector("#fahrenheit");
  colorCelsius.classList.remove("lightened-units");
  colorCelsius.classList.add("darkened-units");
  colorFahrenheit.classList.remove("darkened-units");
  colorFahrenheit.classList.add("lightened-units");
  convertToFahrenheit();
}

function changeUnitsToCelsius(event) {
  event.preventDefault();
  let colorCelsius = document.querySelector("#celsius");
  let colorFahrenheit = document.querySelector("#fahrenheit");
  colorCelsius.classList.remove("darkened-units");
  colorCelsius.classList.add("lightened-units");
  colorFahrenheit.classList.remove("lightened-units");
  colorFahrenheit.classList.add("darkened-units");
  convertToCelsius();
}

function changeTodayDate() {
  let now = new Date();
  /*   let day = now.getDay(); */
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
  if (city === "Current location") {
    navigator.geolocation.getCurrentPosition(retrieveDatafromApi);
  } else {
    let _apiUrl = `${API_URL}forecast?query=${city}&key=${API_KEY}&units=metric`;
    axios.get(_apiUrl).then(updateData);
  }
}

function retrieveDatafromApi(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let _apiUrl = `${API_URL}forecast?lon=${lon}&lat=${lat}&key=${API_KEY}&units=metric`;
  axios.get(_apiUrl).then(updateData);
}

function updateData(response) {
  //update h1 with city name
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.city;

  //update const temperatures
  currentCelsiusTemp = response.data.daily[1].temperature.day;
  currentMinTemp = response.data.daily[1].temperature.minimum;
  currentMaxTemp = response.data.daily[1].temperature.maximum;

  //---if celsius is selected update in celsius
  if (document.getElementById("celsius").className === "lightened-units") {
    convertToCelsius();
  } else {
    //---if fahrenheit is selected update in fahrenheit
    convertToFahrenheit();
  }
  //update humidity and Wind
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  humidity.innerHTML = `${Math.round(
    response.data.daily[1].temperature.humidity
  )}`;
  wind.innerHTML = `${Math.round(response.data.daily[1].wind.speed)}`;

  //update main weather emote
  let mainIcon = document.querySelector("#today-icon");
  mainIcon.setAttribute("src", response.data.daily[1].condition.icon_url);

  //update weather sentence
  let sentenceWeather = document.querySelector(".sentence-weather");
  sentenceWeather.innerHTML = capitaliseFirstLetter(
    response.data.daily[1].condition.description
  );

  //update forecast
  let nextDays = ["Fri", "Sat", "Sun", "Mon", "Tue"];
  let forecast = document.querySelector("#forecast");
  forecast.innerHTML = ``;
  nextDays.forEach(function (day) {
    forecast.innerHTML += `<div class="col-2">
              <ul >
                <li class="next-day-day">${day}</li>
                <li class="next-day-icon">🌦️</li>
                <li class="next-day-date">16/05</li>
              </ul>
          </div>`;
  });
}

function convertToCelsius() {
  let mainTemp = document.querySelector("#mainTemp");
  let minTemp = document.querySelector("#min-temp");
  let maxTemp = document.querySelector("#max-temp");
  mainTemp.innerHTML = Math.round(currentCelsiusTemp);
  minTemp.innerHTML = Math.round(currentMinTemp);
  maxTemp.innerHTML = Math.round(currentMaxTemp);
}

function convertToFahrenheit() {
  let mainTemp = document.querySelector("#mainTemp");
  let minTemp = document.querySelector("#min-temp");
  let maxTemp = document.querySelector("#max-temp");
  mainTemp.innerHTML = Math.round((currentCelsiusTemp * 9) / 5 + 32);
  minTemp.innerHTML = Math.round((currentMinTemp * 9) / 5 + 32);
  maxTemp.innerHTML = Math.round((currentMaxTemp * 9) / 5 + 32);
}

//update block to today's date
let todayDate = document.querySelector("#today-date");
todayDate.innerHTML = changeTodayDate();

//default page to specific city first while waiting for the user input
let defaultCity = "Marseille";
let currentCelsiusTemp = null;
let currentMinTemp = null;
let currentMaxTemp = null;
fetchCityStats(defaultCity);

//update city to submitted city
let formElement = document.querySelector("#input-form");
formElement.addEventListener("submit", fetchCity);

//sort the celcius/farehnheit links
let colorCelsius = document.querySelector("#celsius");
let colorFahrenheit = document.querySelector("#fahrenheit");
colorCelsius.addEventListener("click", changeUnitsToCelsius);
colorFahrenheit.addEventListener("click", changeUnitsToFahrenheit);
