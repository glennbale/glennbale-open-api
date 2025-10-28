
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
        citySection.innerHTML += `<p style="color:red;">Unable to load weather data: Please try again later ${error.message}</p>`;
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
        citySection.innerHTML += `<p style="color:red;">Unable to load weather data: Please try again later. ${error.message}</p>`;
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


// Adding location feature

// Returns a list that best match the query or user input
function searchLocations(query) {
    // Clear previous results
    geoResults.innerHTML = '';

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`) //Self note: encodeURIComponent helps with space special characters
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            renderGeoResults(data);
        })
        .catch(error => {
            console.error('Geocoding error:', error);
            const li = document.createElement('li');
            li.textContent = `Could not search locations: Please try again or Try again later if the problem perssist. ${error.message}`;
            geoResults.appendChild(li);
        });
}



// shows the list of result
function renderGeoResults(data) {
    geoResults.innerHTML = '';

    // if searchLocation returns empty list
    if (!data || !data.results || data.results.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No matches found. Please input a proper location';
        geoResults.appendChild(li);
        return;
    }

    data.results.forEach(place => {
        const { name, latitude, longitude, country, admin1 } = place;

        const li = document.createElement('li');

        const label = document.createElement('span');
        label.textContent = admin1 && country
            ? `${name}, ${admin1}, ${country}`
            : `${name}${country ? ', ' + country : ''}`;

        const addBtn = document.createElement('button');
        addBtn.className = 'pick';
        addBtn.textContent = 'Add Location';

        addBtn.addEventListener('click', () => {
            const sectionId = makeUniqueSectionId(name);
            addCitySection({ id: sectionId, title: label.textContent, lat: latitude, lon: longitude });

            getCurrentTemp(latitude, longitude, sectionId);

            //empty search bar
            geoInput.value = '';
            geoResults.innerHTML = '';
            geoInput.focus();
        });

        li.appendChild(label);
        li.appendChild(addBtn);
        geoResults.appendChild(li);
    });
}


function makeUniqueSectionId(name) {
    
    let base = String(name).replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, ''); //removes spaces and special characters
    if (!base) base = 'City';
    let id = base;
    let i = 2;
    while (document.getElementById(id)) {
        id = `${base}${i}`;
        i++;
    }
    return id;
}

// add new city section to add card
function addCitySection({ id, title, lat, lon }) {
    const weatherContainer = document.querySelector('#weather');

    const section = document.createElement('section');
    section.id = id;

    const h1 = document.createElement('h1');
    h1.innerText = title;

    section.appendChild(h1);
    weatherContainer.appendChild(section);

    // addin the cities object
    cities.push({ lat, lon, id });
}

const geoForm = document.querySelector('#geoForm');
const geoInput = document.querySelector('#geoQuery');
const geoResults = document.querySelector('#geoResults');

// use searchLocation function (GEO API) and  return the list API returns 
if (geoForm && geoInput && geoResults) {
    geoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = geoInput.value.trim();
        if (!query) return;
        searchLocations(query);
    });
}