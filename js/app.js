import { UI } from "./view.js";
import { URL } from "./view.js";

UI.INPUT.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    let cityName = UI.INPUT.value;
    const url = `${URL.SERVER_URL}?q=${cityName}&appid=${URL.API}&units=metric`;
    const cityRequest = fetch(url);

    UI.LIKE.classList.remove("active");

    cityRequest
      .then((cityRequest) => cityRequest.json())
      .then((data) => {
        UI.TITLE_CITY.textContent = data.name;
        UI.TEMPERATURE.textContent = Math.round(data.main.temp);

        UI.IMAGE_WEATHER.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        UI.LIKE.addEventListener("click", addFavorite);

        this.parentElement.reset();
      })
      .catch(alert);
  }
});

function addFavorite() {
  this.classList.add("active");

  const isCityLocated = UI.LIST_CITIES.textContent.includes(
    UI.TITLE_CITY.textContent
  );

  if (isCityLocated) {
    alert("Такой город уже есть в вашем списке");
    return;
  }

  const favoriteBlock = document.createElement("li");
  favoriteBlock.classList.add("item");
  favoriteBlock.insertAdjacentHTML(
    "afterbegin",
    `
    <span hidden class='src'>${this.parentElement
      .querySelector(".block__weather-bg img")
      .getAttribute("src")}</span>
    <span hidden class='temp'>${UI.TEMPERATURE.textContent}</span>
    <p>${UI.TITLE_CITY.textContent}</p>
    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line y1="-0.5" x2="20.7803" y2="-0.5" transform="matrix(0.710506 0.703691 -0.65218 0.758064 1 1)" stroke="#998899"/>
      <line y1="-0.5" x2="20.8155" y2="-0.5" transform="matrix(0.693335 -0.720616 0.670126 0.742247 1.56787 16)" stroke="#998899"/>
    </svg>
    `
  );

  const closeIcon = favoriteBlock.querySelector("svg");
  closeIcon.addEventListener("click", deleteBlock);

  favoriteBlock.addEventListener("click", showInfo);

  UI.LIST_CITIES.append(favoriteBlock);
}

function deleteBlock() {
  this.parentElement.remove();
}

function showInfo() {
  UI.TITLE_CITY.textContent = this.querySelector("p").textContent;
  UI.TEMPERATURE.textContent = this.querySelector(".temp").textContent;
  UI.IMAGE_WEATHER.src = this.querySelector(".src").textContent;
}

// Tabs

const blocks = document.querySelectorAll(".block__main-item");
const btns = document.querySelectorAll(".block__main-nav ul li");

btns.forEach((btn) => {
  btn.addEventListener("click", function () {
    let id = btn.getAttribute("data-attr");
    let currentBlock = document.querySelector(id);

    blocks.forEach((item) => {
      item.classList.remove("active");
    });

    btns.forEach((item) => {
      item.classList.remove("active");
    });

    this.classList.add("active");
    currentBlock.classList.add("active");
  });
});
