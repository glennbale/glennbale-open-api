// Los Angeles
fetch(`https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m`)
.then(response => {
    //Handling errors
    if (!response.ok){
        throw new Error(`Error status: ${response.status}`)
    };
    return response.json();
})
.then(weather => {
    console.log(weather);

    const weathertSection = document.querySelector('#weather');
    const weatherList = weathertSection.querySelector('ul');
    const weatherElement = document.createElement("li");
    weatherElement.innerText = `Time: ${weather.current.time}, Temperature: ${weather.current.temperature_2m}`;
    weatherList.appendChild(weatherElement);
        
});

// New York
fetch(`https://api.open-meteo.com/v1/forecast?latitude=40.7143&longitude=-74.006&current=temperature_2m`)
.then(response => {
    //Handling errors
    if (!response.ok){
        throw new Error(`Error status: ${response.status}`)
    };
    return response.json();
})
.then(weather => {
    console.log(weather);

    const weathertSection = document.querySelector('#weather');
    const weatherList = weathertSection.querySelector('ul');
    const weatherElement = document.createElement("li");
    weatherElement.innerText = `Time: ${weather.current.time}, Temperature: ${weather.current.temperature_2m}`;
    weatherList.appendChild(weatherElement);
        
});