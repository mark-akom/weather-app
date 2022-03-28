const searchButton = document.querySelector('.search-btn');
const searchInput = document.querySelector('.city-search');
const place = document.querySelector('.place');
const iconImg = document.querySelector('.icon-img');
const weatherDesc = document.querySelector('.temp-desc')
const tempValue = document.querySelector('.temp-value');
const humidityValue = document.querySelector('.hum-value');
const windValue = document.querySelector('.wind-value');
const feelsValue = document.querySelector('.feel-value');

const weather = (() => {
    const _API_KEY = `6e58b9a04c5a391d7fd4da6259a02c25`;
    let userCity = 'Accra';
    const getCity = (city) => {
        userCity = city;
    }

    const processForecast = ({weather, main, wind, sys, name}) => {
        const { description, icon } = weather[0];
        const { humidity, temp, feels_like } = main
        const { country } = sys;
        const { speed } = wind
        const weatherData = Object.assign({}, {description, icon, humidity, temp, feels_like, speed, country, name})
        updateDOM(weatherData);
    }

    const getCurrentForecast =  async () => {

        try {
            const url = `http://api.openweathermap.org/data/2.5/weather?q=${userCity}&APPID=${_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            processForecast(data);
        } catch (error) {
            console.log(error);
        }

    }

    const updateDOM = (weatherData) => {
        place.textContent = `${weatherData.name} - ${weatherData.country}`;
        iconImg.src = `http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`;
        weatherDesc.textContent = weatherData.description;
        tempValue.textContent = weatherData.temp;
        humidityValue.textContent = weatherData.humidity;
        windValue.textContent = weatherData.speed;
        feelsValue.textContent = weatherData.feels_like
    }

    return {
        getCurrentForecast,
        getCity
    }
})();


searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const userCity = searchInput.value.trim();

    if (userCity.length > 0) {
        // console.log(userCity);
        weather.getCity(userCity);
        weather.getCurrentForecast();
        searchInput.value = '';
    }
})

