const WEATHER_LOCATION = {
  latitude: 49.39814165195334,
  longitude: 11.095801817060158,
};

const MEMBERS_URL = 'data/members.json';
const MEMBERSHIP_LEVELS = {
  2: 'Silver Member',
  3: 'Gold Member',
};

function createSpotlightCard(member) {
  const card = document.createElement('article');
  card.className = 'spotlight-card';

  const logo = document.createElement('img');
  logo.src = member.image;
  logo.alt = `${member.name} logo`;
  logo.width = 64;
  logo.height = 64;
  logo.loading = 'lazy';

  const details = document.createElement('div');
  const name = document.createElement('h3');
  name.textContent = member.name;

  const phone = document.createElement('p');
  phone.textContent = member.phone;

  const address = document.createElement('address');
  address.textContent = member.address;

  const website = document.createElement('a');
  website.href = member.website;
  website.target = '_blank';
  website.rel = 'noopener noreferrer';
  website.textContent = new URL(member.website).hostname.replace(/^www\./, '');

  const level = document.createElement('p');
  level.className = 'spotlight-level';
  level.textContent = MEMBERSHIP_LEVELS[member.membershipLevel];

  details.append(name, phone, address, website, level);
  card.append(logo, details);
  return card;
}

async function loadSpotlights() {
  const spotlightContainer = document.querySelector('#spotlight-cards');

  try {
    const response = await fetch(MEMBERS_URL);
    if (!response.ok) {
      throw new Error(`Member request failed: ${response.status} ${response.statusText}`);
    }

    const { members } = await response.json();
    const eligibleMembers = members.filter(
      (member) => MEMBERSHIP_LEVELS[member.membershipLevel]
    );
    if (eligibleMembers.length < 2) {
      throw new Error('At least two silver or gold members are required for spotlights.');
    }

    const shuffledMembers = [...eligibleMembers];
    for (let index = shuffledMembers.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffledMembers[index], shuffledMembers[randomIndex]] =
        [shuffledMembers[randomIndex], shuffledMembers[index]];
    }
    const spotlightCount = Math.min(
      shuffledMembers.length,
      2 + Math.floor(Math.random() * 2)
    );

    spotlightContainer.replaceChildren(
      ...shuffledMembers.slice(0, spotlightCount).map(createSpotlightCard)
    );
  } catch (error) {
    console.error(error);
    const errorMessage = document.createElement('p');
    errorMessage.className = 'spotlight-status';
    errorMessage.setAttribute('role', 'alert');
    errorMessage.textContent = 'Member spotlights are currently unavailable.';
    spotlightContainer.replaceChildren(errorMessage);
  }
}

function formatForecastDate(timestamp, timezoneOffset) {
  return new Date((timestamp + timezoneOffset) * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function getDailyForecast(forecastData, currentData) {
  const days = new Map();
  const timezoneOffset = forecastData.city.timezone;
  const today = new Date((currentData.dt + timezoneOffset) * 1000)
    .toISOString()
    .slice(0, 10);

  forecastData.list.forEach((entry) => {
    const localDate = new Date((entry.dt + timezoneOffset) * 1000)
      .toISOString()
      .slice(0, 10);
    const day = days.get(localDate) ?? {
      date: entry.dt,
      min: entry.main.temp_min,
      max: entry.main.temp_max,
      icon: entry.weather[0].icon,
      description: entry.weather[0].description,
      noonDistance: Infinity,
    };

    day.min = Math.min(day.min, entry.main.temp_min);
    day.max = Math.max(day.max, entry.main.temp_max);

    const localHour = new Date((entry.dt + timezoneOffset) * 1000).getUTCHours();
    const noonDistance = Math.abs(localHour - 12);
    if (noonDistance < day.noonDistance) {
      day.date = entry.dt;
      day.icon = entry.weather[0].icon;
      day.description = entry.weather[0].description;
      day.noonDistance = noonDistance;
    }

    days.set(localDate, day);
  });

  return [...days.entries()]
    .filter(([date]) => date > today)
    .slice(0, 3)
    .map(([, day]) => day);
}

function renderWeather(currentData, forecastData) {
  const current = currentData.main;
  const currentWeather = currentData.weather[0];
  const timezoneOffset = currentData.timezone;

  document.querySelector('#weather-status').textContent = 'Current conditions';
  const weatherIcon = document.querySelector('#weather-icon');
  weatherIcon.src = `https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;
  weatherIcon.alt = currentWeather.description;
  document.querySelector('#weather-temperature').textContent = `${Math.round(current.temp)}°C`;
  document.querySelector('#weather-description').textContent = currentWeather.description;
  document.querySelector('#weather-feels-like').textContent = `${Math.round(current.feels_like)}°C`;
  document.querySelector('#weather-wind').textContent = `${Math.round(currentData.wind.speed)} m/s`;
  document.querySelector('#weather-humidity').textContent = `${current.humidity}%`;
  document.querySelector('#weather-current-details').hidden = false;
  document.querySelector('#weather-extras').hidden = false;

  const forecastList = document.querySelector('#weather-forecast-list');
  forecastList.replaceChildren(...getDailyForecast(forecastData, currentData).map((day) => {
    const item = document.createElement('li');
    const dateLabel = document.createElement('span');
    dateLabel.className = 'forecast-date';
    dateLabel.textContent = formatForecastDate(day.date, timezoneOffset);

    const condition = document.createElement('span');
    condition.className = 'forecast-condition';
    const icon = document.createElement('img');
    icon.src = `https://openweathermap.org/img/wn/${day.icon}.png`;
    icon.alt = day.description;
    icon.width = 32;
    icon.height = 32;
    condition.appendChild(icon);

    const temperatures = document.createElement('span');
    temperatures.className = 'forecast-temperatures';
    temperatures.textContent = `Low ${Math.round(day.min)}°C / High ${Math.round(day.max)}°C`;

    item.append(dateLabel, condition, temperatures);
    return item;
  }));
}

async function loadWeather() {
  const status = document.querySelector('#weather-status');

  try {
    if (!window.OPENWEATHER_API_KEY) {
      status.textContent = 'Add a valid OpenWeatherMap API key to scripts/weather-config.local.js.';
      return;
    }

    const query = new URLSearchParams({
      lat: WEATHER_LOCATION.latitude,
      lon: WEATHER_LOCATION.longitude,
      units: 'metric',
      appid: window.OPENWEATHER_API_KEY,
    });
    const endpoints = ['weather', 'forecast'].map(
      (endpoint) => `https://api.openweathermap.org/data/2.5/${endpoint}?${query}`
    );
    const responses = await Promise.all(endpoints.map((endpoint) => fetch(endpoint)));
    const results = await Promise.all(responses.map((response) => response.json()));
    const failedResponse = responses.find((response) => !response.ok);
    if (failedResponse) {
      const errorData = results[responses.indexOf(failedResponse)];
      throw new Error(
        `Weather request failed: ${errorData.message ?? failedResponse.statusText}`
      );
    }

    renderWeather(results[0], results[1]);
  } catch (error) {
    console.error(error);
    status.textContent = 'Weather information is currently unavailable.';
    document.querySelector('#weather-forecast-list').replaceChildren();
  }
}

loadWeather();
loadSpotlights();
