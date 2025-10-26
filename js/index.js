
const cities = [
    { lat: 34.05,   lon: -118.25, id: "LosAngeles" },
    { lat: 40.7143, lon: -74.006, id: "NewYork" },
    { lat: 29.42,   lon: -98.49,  id: "SanAntonio" },
    { lat: 41.88,   lon: -87.63,  id: "Chicago" },
    { lat: 25.76,   lon: -80.19,  id: "Miami" },
];

const weatherDescriptions = {
    0: "Clear sky ☀️",
    1: "Mainly clear 🌤️",
    2: "Partly cloudy ⛅",
    3: "Overcast ☁️",
    45: "Fog 🌫️",
    48: "Depositing rime fog 🌫️",
    51: "Light drizzle 🌦️",
    61: "Rain 🌧️",
    71: "Snowfall ❄️",
    95: "Thunderstorm ⛈️"
};

function formatReadableTime(isoTime) {
    const date = new Date(isoTime);
    return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function getCurrentTemp(latitude, longitude, sectionId) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }
        return response.json();
    })
    .then(weather => {
        const citySection = document.querySelector(`#${sectionId}`);
        let weatherList = citySection.querySelector('ul');
        if (!weatherList) {
            weatherList = document.createElement('ul');
            citySection.appendChild(weatherList);
        } else {
            weatherList.innerHTML = ''; // clear previous items so each click shows fresh data
        }

        const weatherElement = document.createElement("li");
        const readableTime = formatReadableTime(weather.current.time);
        weatherElement.innerText = `${readableTime} Temperature: ${weather.current.temperature_2m}°C`;
        weatherList.appendChild(weatherElement);
    })
    .catch(error => {
        console.error('Fetch error:', error);
        const citySection = document.querySelector(`#${sectionId}`);
        citySection.innerHTML += `<p style="color:red;">Unable to load weather data: ${error.message}</p>`;
    });
}



function getCurrentWeatherCode(latitude, longitude, sectionId) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }
        return response.json();
    })
    .then(weather => {
        const citySection = document.querySelector(`#${sectionId}`);

        let weatherList = citySection.querySelector('ul');
        if (!weatherList) {
            weatherList = document.createElement('ul');
            citySection.appendChild(weatherList);
        } else {
            weatherList.innerHTML = ''; // clear previous items so each click shows fresh data
        }

        const code = weather.current.weather_code;
        const desc = weatherDescriptions[code] || `Code ${code}`; // Just in case code does not exist weatherDescription, it prints the code instead.
        const readableTime = formatReadableTime(weather.current.time);

        const weatherElement = document.createElement("li");
        weatherElement.innerText = `${readableTime}\n Condition: ${desc}`;
        weatherList.appendChild(weatherElement);
    })
    .catch(error => {
        console.error('Fetch error:', error);
        const citySection = document.querySelector(`#${sectionId}`);
        citySection.innerHTML += `<p style="color:red;">Unable to load weather data: ${error.message}</p>`;
    });
}


const tempBtn = document.querySelector('.temp-btn');
const conditionBtn = document.querySelector('.condition-btn');

if (tempBtn) {
    tempBtn.addEventListener('click', () => {
        cities.forEach(city => getCurrentTemp(city.lat, city.lon, city.id));
    });
}

if (conditionBtn) {
    conditionBtn.addEventListener('click', () => {
        cities.forEach(city => getCurrentWeatherCode(city.lat, city.lon, city.id));
    });
}


cities.forEach(city => getCurrentTemp(city.lat, city.lon, city.id));
