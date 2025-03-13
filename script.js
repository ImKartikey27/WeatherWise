document.addEventListener("DOMContentLoaded",() =>{
  const cityInput = document.getElementById("city-input")
  const getweatherbtn = document.getElementById("get-weather-btn")
  const weatherinfo = document.getElementById("weather-info")
  const cityname = document.getElementById("city-name")
  const temperature = document.getElementById("temperature")
  const description = document.getElementById("description")
  const errormsg = document.getElementById("error-message")

  const API_KEY = "0e5ae84f7710aec376a9af73b2889708"

  getweatherbtn.addEventListener("click" , async () => {
    const city = cityInput.value.trim()
    if(!city) return;

    // 1.) It may throw an error
    // 2.) Server/Database is always in another continent
    try {
        const weatherData = await fetchWeatherData(city);
        displayWeatherData(weatherData)

    } catch (error) {
        showError();
    }
  })

  async function fetchWeatherData(city){
    // gets the data
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    const response = await fetch(url);
    if(!response.ok){
      throw new Error("City not Found");
    }
    const Data = await response.json();
    return Data;
  }

  function displayWeatherData(data){
    // display
    console.log(data);
    const {name, main, weather, wind, sys} = data;
    
    // Set city name with country
    cityname.textContent = `${name}, ${sys.country}`;
    
    // Update temperature HTML
    temperature.innerHTML = `
      <span class="temp-value">${Math.round(main.temp)}°C</span>
      <span class="temp-feel">Feels like: ${Math.round(main.feels_like)}°C</span>
    `;
    
    // Update weather description
    description.textContent = weather[0].description;
    
    // Update weather icon with Font Awesome icons based on weather condition
    const weatherIconElement = document.getElementById('weather-icon');
    const weatherIconClass = getWeatherIconClass(weather[0].id, weather[0].icon);
    weatherIconElement.innerHTML = `<i class="${weatherIconClass}"></i>`;
    
    // Update weather details with existing elements
    document.getElementById('humidity').textContent = `${main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${data.visibility / 1000} km`;
    
    // unlock the display with animation classes
    weatherinfo.classList.remove('hidden');
    weatherinfo.classList.add('visible');
    errormsg.classList.add("hidden");
  }

  function showError(){
    weatherinfo.classList.add("hidden");
    weatherinfo.classList.remove('visible');
    errormsg.classList.remove('hidden');
    errormsg.classList.add('shake'); // Add shake animation
    
    // Remove shake animation after it completes
    setTimeout(() => {
      errormsg.classList.remove('shake');
    }, 500);
  }
  // Helper function to determine the appropriate Font Awesome icon class based on weather condition
  function getWeatherIconClass(weatherId, iconCode) {
    // Check if it's day or night (iconCode ends with 'd' for day, 'n' for night)
    const isDay = iconCode.endsWith('d');
    
    // Weather condition codes: https://openweathermap.org/weather-conditions
    // Thunderstorm
    if (weatherId >= 200 && weatherId < 300) {
      return 'fas fa-bolt';
    }
    // Drizzle or Rain
    else if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
      return 'fas fa-cloud-rain';
    }
    // Snow
    else if (weatherId >= 600 && weatherId < 700) {
      return 'fas fa-snowflake';
    }
    // Atmosphere (fog, mist, etc.)
    else if (weatherId >= 700 && weatherId < 800) {
      return 'fas fa-smog';
    }
    // Clear
    else if (weatherId === 800) {
      return isDay ? 'fas fa-sun' : 'fas fa-moon';
    }
    // Clouds
    else if (weatherId > 800) {
      return isDay ? 'fas fa-cloud-sun' : 'fas fa-cloud-moon';
    }
    
    // Default
    return 'fas fa-cloud';
  }
})
