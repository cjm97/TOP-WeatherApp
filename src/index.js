//http://api.weatherapi.com/v1/current.json?key=6b1d1ff3871e4566a6c62703233006&q=Sydney// current weather
// http://api.weatherapi.com/v1/forecast.json?key=6b1d1ff3871e4566a6c62703233006&q=Sydney&days=7 //forecast 14days
// https://api.weatherapi.com/v1/search.json?key=6b1d1ff3871e4566a6c62703233006&q=Sydney //search (shows relevant names)

let celsius = true;

function convertTemperature(temperature) {
  if (!celsius) {
    temperature = ((temperature - 32) * 5) / 9; //convert to C
  } else {
    temperature = (temperature * 9) / 5 + 32; //convert to F;
  }
  return temperature.toFixed(1);
}

async function getWeather(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=6b1d1ff3871e4566a6c62703233006&q=${location}&days=7`,
      { mode: 'cors' }
    );
    const data = await response.json();
    let currentLocationData = processLocationData(data.location);
    let currentWeatherData = processCurrentWeather(data);
    let weatherForecast = processFutureWeather(data.forecast.forecastday);
    let hourlyForecast = processHourlyWeather(
      data.forecast.forecastday[0].hour
    );
    return {
      currentWeatherData,
      currentLocationData,
      weatherForecast,
      hourlyForecast,
    };
  } catch (error) {
    console.error(error);
    const errorMessage = `Error getting weather for "${location}": ${error.message}.`;
    console.error(errorMessage);
  }
}

function processCurrentWeather(data) {
  let weatherData = {
    temp: data.current.temp_c,
    feelsLikeTemp: data.current.feelslike_c,
    minTemp: data.forecast.forecastday[0].day.mintemp_c,
    maxTemp: data.forecast.forecastday[0].day.maxtemp_c,
    condition: data.current.condition.text,
    conditionImg: data.current.condition.icon,
    humidity: data.current.humidity,
  };
  return weatherData;
}

function processFutureWeather(data) {
  let forecast = {};
  for (let i = 0; i < 7; i++) {
    forecast[`day${i}`] = {
      date: data[i].date,
      maxTemp: data[i].day.maxtemp_c,
      minTemp: data[i].day.mintemp_c,
      avgTemp: data[i].day.avgtemp_c,
      totalPrecip: data[i].day.totalprecip_mm,
      avgHumidity: data[i].day.avghumidity,
      dailyWillItRain: data[i].day.daily_will_it_rain,
      dailyChanceOfRain: data[i].day.daily_chance_of_rain,
      uvIndex: data[i].day.uv,
      condition: data[i].day.condition,
    };
  }
  return forecast;
}

function processHourlyWeather(data) {
  let hourlyForecast = {};
  for (let i = 0; i < 24; i++) {
    let date = new Date(data[i].time);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (hours.toString().length === 1) {
      hours = '0' + date.getHours();
    }
    if (minutes.toString().length === 1) {
      minutes = '0' + date.getMinutes();
    }
    let time = `${hours}:${minutes}`;

    hourlyForecast[i] = {
      time: time,
      condition: data[i].condition.icon,
      temperature: data[i].temp_c,
    };
  }
  return hourlyForecast;
}

function processLocationData(data) {
  let locationData = {
    country: data.country,
    name: data.name,
    region: data.region,
  };
  return locationData;
}

// DOM related functions

const searchForm = document.querySelector('[data-search-form]');
const searchInput = document.querySelector('[data-search-input]');
const tempConverter = document.querySelector('[data-temperature-conversion]');

//using input to create weather
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (document.contains(document.querySelector('.weather-card'))) {
    document.querySelector('.weather-card').remove();
  }
  if (document.contains(document.querySelector('.week__container'))) {
    document.querySelector('.week__container').remove();
  }
  if (document.contains(document.querySelector('.hourly__container'))) {
    document.querySelector('.hourly__container').remove();
  }
  const {
    currentWeatherData,
    currentLocationData,
    weatherForecast,
    hourlyForecast,
  } = await getWeather(searchInput.value);
  createWeatherInfo(currentWeatherData, currentLocationData);
  createHourlyForecastInfo(hourlyForecast);
  createForecastInfo(weatherForecast);
  searchInput.value = '';
});

tempConverter.addEventListener('click', (e) => {
  let temperatures = document.querySelectorAll('.temp');
  let units = document.querySelectorAll('.metric__imperial');
  temperatures.forEach((temp) => {
    temp.innerText = convertTemperature(temp.innerText);
  });
  units.forEach((unit) => {
    if (unit.innerText === '°C') {
      unit.innerText = '°F';
    } else {
      unit.innerText = '°C';
    }
  });
  celsius = !celsius;
});

//creating current weather information using template
function createWeatherInfo(weatherData, locationData) {
  const template = document
    .getElementById('weather-template')
    .content.cloneNode(true);
  template.querySelector('.country').innerText = locationData.country;
  template.querySelector(
    '.city__region'
  ).innerText = `${locationData.name} ⋅ ${locationData.region}`;
  template.querySelector('#temp__number').innerText = weatherData.temp;
  template.querySelector('#feels__like--number').innerText =
    weatherData.feelsLikeTemp;
  template.querySelector(
    '.weather__conditions'
  ).innerText = `Conditions: ${weatherData.condition}`;
  template.querySelector('.conditions__image').src = weatherData.conditionImg;
  document.querySelector('#weather__container').appendChild(template);
}

// forecast weather information
function createForecastInfo(weatherForecast) {
  let weekContainer = document.createElement('div');
  weekContainer.classList.add('week__container');
  document.querySelector('#weather__container').appendChild(weekContainer);
  for (let key in weatherForecast) {
    const date = new Date(weatherForecast[key].date),
      day = date.getDay(),
      today = new Date();
    daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const template = document
      .getElementById('weather-forecast')
      .content.cloneNode(true);
    template.querySelector('.forecast__header').innerText =
      today.getDay() === date.getDay() ? 'Today' : daysOfWeek[day];
    template.querySelector('#min__temp').innerText =
      weatherForecast[key].minTemp;
    template.querySelector('#max__temp').innerText =
      weatherForecast[key].maxTemp;
    template.querySelector(
      '.forecast__humidity'
    ).innerText += `${weatherForecast[key].avgHumidity}%`;
    template.querySelector('.forecast__rain').innerText = `Rain: ${
      weatherForecast[key].dailyWillItRain
        ? `${weatherForecast[key].dailyChanceOfRain}% 🌧️`
        : ` ${weatherForecast[key].dailyChanceOfRain}% ⛅`
    }`;
    template.querySelector('.forecast__image').src =
      weatherForecast[key].condition.icon;
    document.querySelector('.week__container').appendChild(template);
  }
}

function createHourlyForecastInfo(hourlyForecast) {
  let hourlyContainer = document.createElement('div');
  hourlyContainer.classList.add('hourly__container');
  document.querySelector('#weather__container').appendChild(hourlyContainer);

  for (let key in hourlyForecast) {
    const template = document
      .getElementById('weather-hourly')
      .content.cloneNode(true);
    template.querySelector('.hour__time').innerText = hourlyForecast[key].time;
    template.querySelector('.hour__condition').src =
      hourlyForecast[key].condition;
    template.querySelector('.hour__temperature').innerText =
      hourlyForecast[key].temperature;
    document.querySelector('.hourly__container').appendChild(template);
  }
}
