const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const weatherContainer = document.querySelector(".weather-container");
const userContainer = document.querySelector(".user-container");

const grandAccessContainer = document.querySelector(".grant-access-container");
const searchForm = document.querySelector(".form-container");
const userInfoContainer = document.querySelector(".user-info-container");
const loadingContainer = document.querySelector(".loading-container");

// initial variables
const API_KEY = "34620d7b637759035d367c5496140963";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorege()

function swithTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");
    if (!searchForm.classList.contains("active")) {
      // if search weather button is clicked and it is invisible then make it visible
      grandAccessContainer.classList.remove("active");
      userInfoContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      // if current tab is search weather tab then we have to switch on your weather tab
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      // now the current tab is your weather tab and i will have to display the weather
      // so let's check the local storage first for coordinates if we have saved them there
      getFromSessionStorege();
    }
  }
}
userTab.addEventListener("click", () => {
  // pass clicked tab as input parameter
  swithTab(userTab);
});
searchTab.addEventListener("click", () => {
  // pass clicked tab as input parameter
  swithTab(searchTab);
});

// check if coordinates are already present in session storage
function getFromSessionStorege() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  // if coordinates are not present in session storage
  if (!localCoordinates) {
    grandAccessContainer.classList.add("active");
  } else {
    // if coordinates are present in session storage
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  // make grant access container invisible
  grandAccessContainer.classList.remove("active");
  loadingContainer.classList.add("active");
  // make an API call
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    loadingContainer.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    console.log(err);
  }
}
function renderWeatherInfo(weatherInfo) {
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const weatherDesc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const Temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const clouds = document.querySelector("[data-clouds]");
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = ` https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;
  Temp.innerText = `${weatherInfo?.main?.temp} °c `;
windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
humidity.innerText = `${weatherInfo?.main?.humidity} %`;
  clouds.innerText = `${weatherInfo?.clouds?.all} %`;
}
function getlocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}
function showPosition(position) {
  const usercoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(usercoordinates));
  fetchUserWeatherInfo(usercoordinates);
}
const grandAccessBtn = document.querySelector("[data-grantAccessBtn]");
grandAccessBtn.addEventListener("click", getlocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const cityName = searchInput.value;
  if (cityName === "") return;
    fetchSearchWeatherInfo(cityName);
});
async function fetchSearchWeatherInfo(city) {
  userInfoContainer.classList.remove("active");
  grandAccessContainer.classList.remove("active");
  loadingContainer.classList.add("active");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    console.log(data)
    loadingContainer.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    console.log(err);
  }
}
