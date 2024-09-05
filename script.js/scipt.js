// script.js

// Define the OpenWeatherMap API key
const apiKey = '5b6351a0e0b8b7795b5753e813d3c127';

// Get references to DOM elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const historyContainer = document.getElementById('history');
const forecastContainer = document.getElementById('forecast-container');
const currentCityEl = document.getElementById('current-city');
const currentTempEl = document.getElementById('current-temp');
const currentWindEl = document.getElementById('current-wind');
const currentHumidityEl = document.getElementById('current-humidity');

// Retrieve search history from localStorage or initialize as an empty array
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Function to render the search history buttons
function renderSearchHistory() {
    historyContainer.innerHTML = ''; // Clear the history container
    searchHistory.forEach(city => { // For each city in the search history
        const btn = document.createElement('button'); // Create a button element
        btn.textContent = city; // Set the button text to the city name
        btn.addEventListener('click', () => fetchWeather(city)); // Add click event to fetch weather for that city
        historyContainer.appendChild(btn); // Append the button to the history container
    });
}

// Function to fetch weather data for a given city
function fetchWeather(city) {
    const geoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(geoUrl) // Fetch geographical data for the city
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            const { coord } = data; // Extract coordinates from the data
            fetchForecast(coord.lat, coord.lon); // Fetch the forecast using the coordinates
            updateCurrentWeather(data); // Update the current weather display
        });
}

// Function to fetch the 5-day weather forecast using coordinates
function fetchForecast(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(forecastUrl) // Fetch the forecast data
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            updateForecast(data); // Update the forecast display
        });
}

// Function to update the current weather display
function updateCurrentWeather(data) {
    const { name, weather, main, wind } = data; // Destructure the data object
    const date = new Date().toLocaleDateString(); // Get the current date
    currentCityEl.innerHTML = `${name} (${date}) <span>${weather[0].icon}</span>`; // Update the city and date display
    currentTempEl.textContent = main.temp + '°F'; // Update the temperature display
    currentWindEl.textContent = wind.speed + ' MPH'; // Update the wind speed display
    currentHumidityEl.textContent = main.humidity + '%'; // Update the humidity display
}

// Function to update the 5-day weather forecast display
function updateForecast(data) {
    forecastContainer.innerHTML = ''; // Clear the forecast container
    const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00')); // Filter the forecast data for noon each day

    dailyData.forEach(day => { // For each day's data
        const dayDiv = document.createElement('div'); // Create a div for the day
        dayDiv.classList.add('day'); // Add the 'day' class to the div
        dayDiv.innerHTML = `
            <h3>${new Date(day.dt_txt).toLocaleDateString()}</h3> <!-- Display the date -->
            <p><img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}"></p> <!-- Display the weather icon -->
            <p>Temp: ${day.main.temp} °F</p> <!-- Display the temperature -->
            <p>Wind: ${day.wind.speed} MPH</p> <!-- Display the wind speed -->
            <p>Humidity: ${day.main.humidity} %</p> <!-- Display the humidity -->
        `;
        forecastContainer.appendChild(dayDiv); // Append the day's div to the forecast container
    });
}

// Event listener for the search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value; // Get the city name from the input
    if (city && !searchHistory.includes(city)) { // If the city is valid and not in the history
        searchHistory.push(city); // Add the city to the search history
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory)); // Save the updated history to localStorage
        renderSearchHistory(); // Re-render the search history
    }
    fetchWeather(city); // Fetch the weather for the city
});

// Load the search history when the page loads
document.addEventListener('DOMContentLoaded', renderSearchHistory);
