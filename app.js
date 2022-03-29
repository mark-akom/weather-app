const searchButton = document.querySelector('.search-btn');
const searchInput = document.querySelector('.city-search');
const place = document.querySelector('.place');
const iconImg = document.querySelector('.icon-img');
const weatherDesc = document.querySelector('.temp-desc')
const tempValue = document.querySelector('.temp-value');
const humidityValue = document.querySelector('.hum-value');
const windValue = document.querySelector('.wind-value');
const feelsValue = document.querySelector('.feel-value');
const tempToggle = document.querySelector('.temp-toggle');
const weatherContainer = document.querySelector('.weather-container');
const loading = document.querySelector('.loading');
const errorDisplay = document.querySelector('.error');

const weather = (() => {
    const _API_KEY = `6e58b9a04c5a391d7fd4da6259a02c25`;
    let userCity;
    let processedData = {};
    const getCity = (city) => {
        userCity = city;
    }

    const processForecast = ({weather, main, wind, sys, name}) => {
        const { description, icon } = weather[0];
        let { humidity, temp, feels_like } = main
        const { country } = sys;
        const { speed } = wind;
        temp = parseFloat((temp - 273.15).toFixed(2));
        feels_like = parseFloat((feels_like - 273.15).toFixed(2));
        const weatherData = Object.assign({}, {description, icon, humidity, temp, feels_like, speed, country, name})
        updateDOM(weatherData);
        processedData = Object.assign({}, weatherData);
    }

    const getCurrentForecast =  async () => {
        try {
            loading.style.display = 'block';
            errorDisplay.style.display = 'none';
            weatherContainer.style.display = 'none';
            tempToggle.style.display = 'none';
            const url = `http://api.openweathermap.org/data/2.5/weather?q=${userCity}&APPID=${_API_KEY}`;
            const response = await fetch(url, {mode: 'cors'});
            const data = await response.json();

            if (data.cod !== '404') {
                processForecast(data);
                loading.style.display = 'none';
                weatherContainer.style.display = 'block';
                tempToggle.style.display = 'block'
            } else {
                loading.style.display = 'none';
                errorDisplay.style.display = 'block';
                errorDisplay.textContent = data.message;
            }
        } catch (error) {
            errorDisplay.style.display = 'block';
            errorDisplay.textContent = 'Opps an error occured';
        }

    }

    const updateDOM = (weatherData) => {
        place.textContent = `${weatherData.name} - ${weatherData.country}`;
        iconImg.src = `http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`;
        weatherDesc.textContent = weatherData.description;
        tempValue.innerHTML = `${weatherData.temp} &#8451;`;
        humidityValue.textContent = `${weatherData.humidity}%`;
        windValue.textContent = `${weatherData.speed}m/s`;
        feelsValue.innerHTML = ` ${weatherData.feels_like} &#8451;`;
    }

    const returnProcessedData = () => {
        return processedData;
    }

    return {
        getCurrentForecast,
        getCity,
        returnProcessedData,
    }
})();

function convertTempToCelsius({feels_like, temp}) {
    tempValue.innerHTML = `${temp.toFixed(2)} &#8451;`
    feelsValue.innerHTML = ` ${feels_like.toFixed(2)} &#8451;`
}

function convertTempToFahrenheit({feels_like, temp}) {
    let currentTemp = (temp * (9 / 5)) + 32;
    let currentFeels = (feels_like * (9 / 5)) + 32;
    tempValue.innerHTML = `${currentTemp.toFixed(2)} &#8457;`
    feelsValue.innerHTML = ` ${currentFeels.toFixed(2)} &#8457;`
}

tempToggle.addEventListener('click', () => { // temperature toggle button
    const span = tempToggle.firstElementChild
    if(span.className === 'F') {
        span.className = 'C';
        span.innerHTML = '&#8451;'
        convertTempToFahrenheit(weather.returnProcessedData())
    } else {
        span.className = 'F'
        span.innerHTML = '&#8457;'
        convertTempToCelsius(weather.returnProcessedData());
    }
})


searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const userCity = searchInput.value.trim();

    if (userCity.length > 0) {
        weather.getCity(userCity);
        weather.getCurrentForecast();
        searchInput.value = '';
    }
})

