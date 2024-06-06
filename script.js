document.addEventListener('DOMContentLoaded', function () {
    let savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];

    function saveCity(city) {
        if (!savedCities.includes(city)) {
            savedCities.push(city);
            localStorage.setItem('savedCities', JSON.stringify(savedCities));
            populateDropdown();
        }
    }

    function populateDropdown() {
        const select = document.getElementById('savedCities');
        select.innerHTML = '';

        savedCities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            select.appendChild(option);
        });
    }

    populateDropdown();

    // Listen for click on getWeather button (for five-day forecast)
    document.getElementById('getWeather').addEventListener('click', function () {
        const API_KEY = 'c001c20a4ba13dc7e4270b22e9c1034a';
        const CITY = document.querySelector('.userInput').value.charAt(0).toUpperCase() + document.querySelector('.userInput').value.slice(1).toLowerCase();
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Start from tomorrow
        const startDate = tomorrow.toISOString().split('T')[0];

        const fiveDayForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&cnt=40`; // Fetching a larger count to ensure we have enough data

        fetch(fiveDayForecastUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log("Five Day Forecast Data \n----------");
                let forecastHTML = ''; // Initialize an empty string to accumulate forecast cards
                let displayedDates = []; // Array to track displayed dates

                // Loop through the list of forecasts
                for (let i = 0; i < data.list.length; i++) {
                    const forecast = data.list[i];
                    const forecastDate = new Date(forecast.dt * 1000); // Convert timestamp to date object
                    const dateText = forecastDate.toISOString().split('T')[0];

                    // Check if the date is unique and add to forecastHTML
                    if (!displayedDates.includes(dateText) && dateText > startDate) {
                        displayedDates.push(dateText);
                        const temperature = ((forecast.main.temp - 273.15) * 9/5 + 32).toFixed(2);
                        const weatherDescription = forecast.weather[0].main;
                        const humidity = forecast.main.humidity;
                        const windSpeed = forecast.wind.speed;

                        // Create HTML for each forecast card and append to forecastHTML
                        forecastHTML += `
                            <div class="weather-card">
                                <h2>Weather in ${CITY} - ${dateText}</h2>
                                <p>Temperature: ${temperature}°F</p>
                                <p>Condition: ${weatherDescription}</p>
                                <p>Humidity: ${humidity}%</p>
                                <p>Wind Speed: ${windSpeed} km/h</p>
                            </div>
                        `;
                    }

                    // Break the loop once we have displayed five unique dates
                    if (displayedDates.length >= 5) {
                        break;
                    }
                }

                // Display all forecast cards at once
                document.getElementById('fiveDay').innerHTML = forecastHTML;

                // Change container styles
                document.getElementById('fiveDay').style.backgroundColor = '#d9dad7';
                document.getElementById('fiveDay').style.color = '#1a2639';
            })
            .catch(function (error) {
                console.error('Error fetching five-day forecast data:', error);
                document.getElementById('fiveDay').innerHTML = '<p>Error fetching weather data. Please try again.</p>';
                document.getElementById('fiveDay').style.backgroundColor = '#1a2639'; // Dark background color
                document.getElementById('fiveDay').style.color = 'white'; // White text color
            });
    });

    // Listen for click on getWeather button (for current weather)
    document.getElementById('getWeather').addEventListener('click', function () {
        const API_KEY = 'c001c20a4ba13dc7e4270b22e9c1034a';
        const CITY = document.querySelector('.userInput').value.charAt(0).toUpperCase() + document.querySelector('.userInput').value.slice(1).toLowerCase();
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}`;

        fetch(currentWeatherUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log('Current Weather Data \n----------');
                console.log(data);

                if (data.cod === '404') {
                    document.getElementById('weatherContainer').innerHTML = '<p>City not found. Please try again.</p>';
                    document.getElementById('weatherContainer').style.backgroundColor = '#1a2639';
                    document.getElementById('weatherContainer').style.color = 'white';
                } else {
                    const temperature = ((data.main.temp - 273.15) * 9/5 + 32).toFixed(2); // Convert from Kelvin to Fahrenheit
                    const weatherDescription = data.weather[0].main;
                    const humidity = data.main.humidity;
                    const windSpeed = data.wind.speed;

                    const weatherHTML = `
                        <div class="weather-card">
                            <h2>Weather in ${CITY}</h2>
                            <p>Temperature: ${temperature}°F</p>
                            <p>Condition: ${weatherDescription}</p>
                            <p>Humidity: ${humidity}%</p>
                            <p>Wind Speed: ${windSpeed} km/h</p>
                        </div>
                    `;
                    
                    // Display weather information
                    document.getElementById('weatherContainer').innerHTML = weatherHTML;
                    document.getElementById('weatherContainer').style.backgroundColor = '#d9dad7';
                    document.getElementById('weatherContainer').style.color = '#1a2639';

                    // Save city to local storage
                    saveCity(CITY);
                }
            })
            .catch(function (error) {
                console.error('Error fetching current weather data:', error);
                document.getElementById('weatherContainer').innerHTML = '<p>Error fetching weather data. Please try again.</p>';
                document.getElementById('weatherContainer').style.backgroundColor = '#1a2639'; // Dark background color
                document.getElementById('weatherContainer').style.color = 'white'; // White text color
            });
    });

    // Listen for click on getSavedWeather button (for saved weather selection)
    document.getElementById('getSavedWeather').addEventListener('click', function () {
        const selectedCity = document.getElementById('savedCities').value;
        const API_KEY = 'c001c20a4ba13dc7e4270b22e9c1034a';
        const savedWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}`;

        fetch(savedWeatherUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log('Saved Weather Data \n----------');
                console.log(data);

                if (data.cod === '404') {
                    document.getElementById('weatherContainer').innerHTML = '<p>City not found. Please try again.</p>';
                    document.getElementById('weatherContainer').style.backgroundColor = '#1a2639';
                    document.getElementById('weatherContainer').style.color = 'white';
                } else {
                    const temperature = ((data.main.temp - 273.15) * 9/5 + 32).toFixed(2);
                    const weatherDescription = data.weather[0].main;
                    const humidity = data.main.humidity;
                    const windSpeed = data.wind.speed;

                    const weatherHTML = `
                        <div class="weather-card">
                            <h2>Weather in ${selectedCity}</h2>
                            <p>Temperature: ${temperature}°F</p>
                            <p>Condition: ${weatherDescription}</p>
                            <p>Humidity: ${humidity}%</p>
                            <p>Wind Speed: ${windSpeed} km/h</p>
                        </div>
                    `;

                    // Display weather information
                    document.getElementById('weatherContainer').innerHTML = weatherHTML;
                    document.getElementById('weatherContainer').style.backgroundColor = '#d9dad7'; 
                    document.getElementById('weatherContainer').style.color = '#1a2639';
                }
            })
            .catch(function (error) {
                console.error('Error fetching saved weather data:', error);
                document.getElementById('weatherContainer').innerHTML = '<p>Error fetching weather data. Please try again.</p>';
                document.getElementById('weatherContainer').style.backgroundColor = '#1a2639';
                document.getElementById('weatherContainer').style.color = 'white';
            });
    });

});