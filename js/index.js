const losAngeles = {
    latitude: 52.52,
    longitude: 13.41
}

const newYork = {
    latitude: 40.7143,
    longitude: -74.006
}

function getWeather(latitude, longitude) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`)
    .then(response => {
        // Handle response errors
        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }
        return response.json();
    })
    .then(weather => {
        console.log(weather);

        const weatherSection = document.querySelector('#weather');
        const weatherList = weatherSection.querySelector('ul');

        const weatherElement = document.createElement("li");
        weatherElement.innerText = `Time: ${weather.current.time}, Temperature: ${weather.current.temperature_2m}°C`;
        weatherList.appendChild(weatherElement);
    })
    .catch(error => {
        console.error('Fetch error:', error);
        const weatherSection = document.querySelector('#weather');
        weatherSection.innerHTML = `<p style="color:red;">Unable to load weather data: ${error.message}</p>`;
    });
}




function getApparentTemperature(latitude, longitude) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=apparent_temperature`)
    .then(response => {
        // Handle response errors
        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }
        return response.json();
    })
    .then(weather => {
        console.log(weather);

        const weatherSection = document.querySelector('#weather');
        const weatherList = weatherSection.querySelector('ul');

        const weatherElement = document.createElement("li");
        weatherElement.innerText = `Time: ${weather.current.time}, Apparent Temperature: ${weather.current.apparent_temperature}°C`;
        weatherList.appendChild(weatherElement);
    })
    .catch(error => {
        console.error('Fetch error:', error);
        const weatherSection = document.querySelector('#weather');
        weatherSection.innerHTML = `<p style="color:red;">Unable to load apparent temperature: ${error.message}</p>`;
    });
}

getWeather(losAngeles.latitude, losAngeles.longitude);
getApparentTemperature(losAngeles.latitude, losAngeles.longitude);
getWeather(newYork.latitude,newYork.longitude);
getApparentTemperature(newYork.latitude, newYork.longitude);


