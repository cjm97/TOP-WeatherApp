/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("//http://api.weatherapi.com/v1/current.json?key=6b1d1ff3871e4566a6c62703233006&q=Sydney// current weather\r\n// http://api.weatherapi.com/v1/forecast.json?key=6b1d1ff3871e4566a6c62703233006&q=Sydney&days=7 //forecast 14days\r\n// https://api.weatherapi.com/v1/search.json?key=6b1d1ff3871e4566a6c62703233006&q=Sydney //search (shows relevant names)\r\n\r\nlet celsius = true;\r\nasync function getWeather(location) {\r\n  try {\r\n    const response = await fetch(\r\n      `http://api.weatherapi.com/v1/forecast.json?key=6b1d1ff3871e4566a6c62703233006&q=${location}&days=7`,\r\n      { mode: 'cors' }\r\n    );\r\n    const data = await response.json();\r\n    let currentLocationData = processLocationData(data.location);\r\n    let currentWeatherData = processCurrentWeather(data);\r\n    let weatherForecast = processFutureWeather(data.forecast.forecastday);\r\n    return { currentWeatherData, currentLocationData, weatherForecast };\r\n  } catch (error) {\r\n    const errorMessage = `Error getting weather for \"${location}\": ${error.message}.`;\r\n    console.error(errorMessage);\r\n  }\r\n}\r\n\r\nfunction processCurrentWeather(data) {\r\n  let weatherData = {\r\n    temp: data.current.temp_c,\r\n    feelsLikeTemp: data.current.feelslike_c,\r\n    minTemp: data.forecast.forecastday[0].day,\r\n    maxTemp: data.forecast.forecastday[0].day,\r\n    condition: data.current.condition.text,\r\n    conditionImg: data.current.condition.icon,\r\n    humidity: data.current.humidity,\r\n  };\r\n  return weatherData;\r\n}\r\n\r\nfunction processFutureWeather(data) {\r\n  let forecast = {};\r\n  for (let i = 0; i < 7; i++) {\r\n    forecast[`day${i}`] = {\r\n      date: data[i].date,\r\n      maxTemp: data[i].day.maxtemp_c,\r\n      minTemp: data[i].day.mintemp_c,\r\n      avgTemp: data[i].day.avgtemp_c,\r\n      totalPrecip: data[i].day.totalprecip_mm,\r\n      avgHumidity: data[i].day.avghumidity,\r\n      dailyWillItRain: data[i].day.daily_will_it_rain,\r\n      dailyChanceOfRain: data[i].day.daily_chance_of_rain,\r\n      uvIndex: data[i].day.uv,\r\n      condition: data[i].condition,\r\n    };\r\n  }\r\n  console.log(forecast);\r\n  return forecast;\r\n}\r\n\r\nfunction processLocationData(data) {\r\n  let locationData = {\r\n    country: data.country,\r\n    localTime: data.localtime,\r\n    name: data.name,\r\n    region: data.region,\r\n  };\r\n  return locationData;\r\n}\r\n\r\nfunction convertTemperature(temperature) {\r\n  if (!celsius) {\r\n    temperature = ((temperature - 32) * 5) / 9; //convert to C\r\n  } else {\r\n    temperature = (temperature * 9) / 5 + 32; //convert to F;\r\n  }\r\n  celsius = !celsius;\r\n  return temperature;\r\n}\r\n// DOM related functions\r\n\r\nconst searchForm = document.querySelector('[data-search-form]');\r\nconst searchInput = document.querySelector('[data-search-input]');\r\n\r\n//using input to create weather\r\nsearchForm.addEventListener('submit', async (e) => {\r\n  e.preventDefault();\r\n  if (document.contains(document.querySelector('.weather-card'))) {\r\n    document.querySelector('.weather-card').remove();\r\n  }\r\n  const { currentWeatherData, currentLocationData } = await getWeather(\r\n    searchInput.value\r\n  );\r\n  createWeatherInfo(currentWeatherData, currentLocationData);\r\n  searchInput.value = '';\r\n});\r\n\r\n//creating current weather information using template\r\nfunction createWeatherInfo(weatherData, locationData) {\r\n  const template = document\r\n    .getElementById('weather-template')\r\n    .content.cloneNode(true);\r\n  template.querySelector('.country').innerText = locationData.country;\r\n  template.querySelector(\r\n    '.city__region'\r\n  ).innerText = `${locationData.name} - ${locationData.region}`;\r\n  template.querySelector('.local__time').innerText = locationData.localTime;\r\n  template.querySelector(\r\n    '.temperature'\r\n  ).innerText = `Temperature: ${weatherData.tempC} °C`;\r\n  template.querySelector(\r\n    '.feels__like--temp'\r\n  ).innerText = `Feels like: ${weatherData.feelsLikeTempC} °C`;\r\n  template.querySelector(\r\n    '.weather__conditions'\r\n  ).innerText = `Conditions: ${weatherData.condition}`;\r\n  template.querySelector('.conditions__image').src = weatherData.conditionImg;\r\n  document.querySelector('#weather__container').appendChild(template);\r\n}\r\n\n\n//# sourceURL=webpack://top-weatherapp/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;