
const weather = (() => {
    const _API_KEY = `6e58b9a04c5a391d7fd4da6259a02c25`;
    let userCity = 'Abuja';
    const getCity = (city) => {
        userCity = city;
    }

    const processForecast = ({weather, main, wind}) => {
        const { description, icon } = weather[0];
        const { humidity, temp, } = main
        const { speed } = wind
        console.log(wind);
    }

    const getCurrentForecast =  async () => {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${userCity}&APPID=${_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        processForecast(data);
    }

    return {
        getCurrentForecast,
        getCity
    }
})();

// weather.getCity('Kumasi');

// weather.getCurrentForecast();
