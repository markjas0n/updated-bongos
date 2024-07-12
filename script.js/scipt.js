// script.js
const apiKey = '5b6351a0e0b8b7795b5753e813d3c127';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const historyContainer = document.getElementById('history');
const forecastContainer = document.getElementById('forecast-container');
const currentCityEl = document.getElementById('current-city');
const currentTempEl = document.getElementById('current-temp');
const currentWindEl = document.getElementById('current-wind');
const currentHumidityEl = document.getElementById('current-humidity');

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

function renderSearchHistory() {
    historyContainer.innerHTML = '';
    searchHistory.forEach(city => {
        const btn = document.createElement('button');
        btn.textContent = city;
        btn.addEventListener('click', () => fetchWeather(city));
        historyContainer.appendChild(btn);
    });
}

function fetchWeather(city) {
    const geoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            const { coord } = data;
            fetchForecast(coord.lat, coord.lon);
            updateCurrentWeather(data);
        });
}

function fetchForecast(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            updateForecast(data);
        });
}

function updateCurrentWeather(data) {
    const { name, weather, main, wind } = data;
    const date = new Date().toLocaleDateString();
    currentCityEl.innerHTML = `${name} (${date}) <span>${weather[0].icon}</span>`;
    currentTempEl.textContent = main.temp + '°F';
    currentWindEl.textContent = wind.speed + ' MPH';
    currentHumidityEl.textContent = main.humidity + '%';
}

function updateForecast(data) {
    forecastContainer.innerHTML = '';
    const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    dailyData.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.innerHTML = `
            <h3>${new Date(day.dt_txt).toLocaleDateString()}</h3>
            <p><img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}"></p>
            <p>Temp: ${day.main.temp} °F</p>
            <p>Wind: ${day.wind.speed} MPH</p>
            <p>Humidity: ${day.main.humidity} %</p>
        `;
        forecastContainer.appendChild(dayDiv);
    });
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city && !searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        renderSearchHistory();
    }
    fetchWeather(city);
});

document.addEventListener('DOMContentLoaded', renderSearchHistory);
