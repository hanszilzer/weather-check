var APIKey = '29e2a64c545b4a33ed85c5c8f9c1be59';
var cityInput = document.getElementById('city');
var previousCities = [];
var buttonCities = document.getElementById('last-cities');

function createAndAppendButton(cityName) {
  var button = document.createElement('button');
  button.textContent = cityName;
  button.style.display = 'block';
  button.setAttribute('class', 'btn btn-outline-success');
  buttonCities.appendChild(button);

  button.addEventListener('click', function () {
    getCityInput(cityName);
  });
}

function filterBlankAndDuplicates(cityList) {
  var filteredCities = [];
  for (var i = 0; i < cityList.length; i++) {
    var city = cityList[i].trim();
    if (city !== '' && !filteredCities.includes(city)) {
      filteredCities.push(city);
    }
  }
  return filteredCities;
}

function getCityInput(cityName) {
  var city = cityName;
  var cityURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;

  fetch(cityURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      updateSearchedCity(cityName);

      var lat = data.coord.lat;
      var lon = data.coord.lon;
      var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;

      var todayForecast = document.getElementById('today-forecast');
      todayForecast.textContent = 'Temperature: ' + data.main.temp + '°F';

      return fetch(forecastURL);
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      for (let i = 1; i <= 5; i++) {
        var forecastEl = document.getElementById('forecast' + i);
        var cloudEl = document.getElementById('cloud' + i);
        cloudEl.textContent = data.list[i - 1].weather[0].description + ' ';
        forecastEl.textContent =
          'High: ' + data.list[i - 1].main.temp_max + ' Low: ' + data.list[i - 1].main.temp_min;
      }
    });
}

document.querySelector('form').addEventListener('submit', function (event) {
  event.preventDefault();
  var city = cityInput.value;

  if (city.trim() !== '' && !previousCities.includes(city)) {
    getCityInput(city);

    previousCities.push(city);
    localStorage.setItem('previousCities', JSON.stringify(previousCities));

    createAndAppendButton(city);
  }
});

window.addEventListener('load', function () {
  var storedCities = localStorage.getItem('previousCities');
  if (storedCities) {
    previousCities = JSON.parse(storedCities);
    previousCities = filterBlankAndDuplicates(previousCities);
    localStorage.setItem('previousCities', JSON.stringify(previousCities));
    previousCities.forEach(function (city) {
      createAndAppendButton(city);
    });
  }
});

function updateSearchedCity(cityName) {
  var dateTime = dayjs().format('ddd, MMMM DD');
  var searchedCityElement = document.getElementById('searched-city-name');
  searchedCityElement.textContent = cityName + ': ' + dateTime;
}

getCityInput('Chicago');


var todayDate = dayjs().format('dddd, MMMM DD');
document.getElementById('date1').textContent = todayDate;

for (let i = 2; i <= 6; i++) {
  var nextDate = dayjs().add(i - 1, 'day').format('dddd, MMMM DD');
  document.getElementById('date' + i).textContent = nextDate;
}
