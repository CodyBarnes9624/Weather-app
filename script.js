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

    // listen for click on getweather id
    document.getElementById('getWeather').addEventListener('click', function () {
        const API_KEY = 'c001c20a4ba13dc7e4270b22e9c1034a';
        const CITY = document.querySelector('.userInput').value.charAt(0).toUpperCase() + document.querySelector('.userInput').value.slice(1).toLowerCase();
        const requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}`;
        const fiveDayForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}`;

        fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log('Weather Data \n----------');
                console.log(data);

                if (data.cod === '404') {
                    document.getElementById('weatherContainer').innerHTML = '<p>City not found. Please try again.</p>';
                    document.getElementById('weatherContainer').style.backgroundColor = '#1a2639';
                    document.getElementById('weatherContainer').style.color = 'white';
                } else {
                    const temperature = ((data.main.temp - 273.15) * 9/5 + 32).toFixed(2); //did this to convert from kelvin  to F
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
                    
                    //making the cards
                    document.getElementById('weatherContainer').innerHTML = weatherHTML;
                    document.getElementById('weatherContainer').style.backgroundColor = '#d9dad7';
                    document.getElementById('weatherContainer').style.color = '#1a2639';

                    // save it
                    saveCity(CITY);
                }
            })
            .catch(function (error) {
                console.error('Error fetching weather data:', error);
                document.getElementById('weatherContainer').innerHTML = '<p>Error fetching weather data. Please try again.</p>';
                document.getElementById('weatherContainer').style.backgroundColor = '#1a2639'; 
                document.getElementById('weatherContainer').style.color = 'white'; 
            });
    });

    // listen for saved weather selection
    document.getElementById('getSavedWeather').addEventListener('click', function () {
        const selectedCity = document.getElementById('savedCities').value;
        const API_KEY = 'c001c20a4ba13dc7e4270b22e9c1034a';
        const requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}`;

        fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log('Weather Data \n----------');
                console.log(data);

                if (data.cod === '404') {
                    // City not found
                    document.getElementById('weatherContainer').innerHTML = '<p>City not found. Please try again.</p>';
                    document.getElementById('weatherContainer').style.backgroundColor = '#1a2639';
                    document.getElementById('weatherContainer').style.color = 'white';
                } else {
                    // City found
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

                    document.getElementById('weatherContainer').innerHTML = weatherHTML;
                    document.getElementById('weatherContainer').style.backgroundColor = '#d9dad7'; 
                    document.getElementById('weatherContainer').style.color = '#1a2639';
                }
            })
            .catch(function (error) {
                console.error('Error fetching weather data:', error);
                document.getElementById('weatherContainer').innerHTML = '<p>Error fetching weather data. Please try again.</p>';
                document.getElementById('weatherContainer').style.backgroundColor = '#1a2639';
                document.getElementById('weatherContainer').style.color = 'white';
            });
    });
});
