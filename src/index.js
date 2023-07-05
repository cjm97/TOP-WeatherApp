//http://api.weatherapi.com/v1/current.json?key=6b1d1ff3871e4566a6c62703233006&q=Sydney// current weather
// http://api.weatherapi.com/v1/forecast.json?key=6b1d1ff3871e4566a6c62703233006&q=Sydney&days=7 //forecast 14days
// https://api.weatherapi.com/v1/search.json?key=6b1d1ff3871e4566a6c62703233006&q=Sydney //search (shows relevant names)

let celsius = true;
async function getWeather(location) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=6b1d1ff3871e4566a6c62703233006&q=${location}&days=7`,
      { mode: 'cors' }
    );
    const data = await response.json();
    let currentLocationData = processLocationData(data.location);
    let currentWeatherData = processCurrentWeather(data);
    let weatherForecast = processFutureWeather(data.forecast.forecastday);
    return { currentWeatherData, currentLocationData, weatherForecast };
  } catch (error) {
    const errorMessage = `Error getting weather for "${location}": ${error.message}.`;
    console.error(errorMessage);
  }
}

function processCurrentWeather(data) {
  let weatherData = {
    temp: data.current.temp_c,
    feelsLikeTemp: data.current.feelslike_c,
    minTemp: data.forecast.forecastday[0].day,
    maxTemp: data.forecast.forecastday[0].day,
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
      condition: data[i].condition,
    };
  }
  console.log(forecast);
  return forecast;
}

function processLocationData(data) {
  let locationData = {
    country: data.country,
    localTime: data.localtime,
    name: data.name,
    region: data.region,
  };
  return locationData;
}

function convertTemperature(temperature) {
  if (!celsius) {
    temperature = ((temperature - 32) * 5) / 9; //convert to C
  } else {
    temperature = (temperature * 9) / 5 + 32; //convert to F;
  }
  celsius = !celsius;
  return temperature;
}
// DOM related functions

const searchForm = document.querySelector('[data-search-form]');
const searchInput = document.querySelector('[data-search-input]');

//using input to create weather
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (document.contains(document.querySelector('.weather-card'))) {
    document.querySelector('.weather-card').remove();
  }
  const { currentWeatherData, currentLocationData } = await getWeather(
    searchInput.value
  );
  createWeatherInfo(currentWeatherData, currentLocationData);
  searchInput.value = '';
});

//creating current weather information using template
function createWeatherInfo(weatherData, locationData) {
  const template = document
    .getElementById('weather-template')
    .content.cloneNode(true);
  template.querySelector('.country').innerText = locationData.country;
  template.querySelector(
    '.city__region'
  ).innerText = `${locationData.name} - ${locationData.region}`;
  template.querySelector('.local__time').innerText = locationData.localTime;
  template.querySelector(
    '.temperature'
  ).innerText = `Temperature: ${weatherData.tempC} °C`;
  template.querySelector(
    '.feels__like--temp'
  ).innerText = `Feels like: ${weatherData.feelsLikeTempC} °C`;
  template.querySelector(
    '.weather__conditions'
  ).innerText = `Conditions: ${weatherData.condition}`;
  template.querySelector('.conditions__image').src = weatherData.conditionImg;
  document.querySelector('#weather__container').appendChild(template);
}