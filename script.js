let apiKey = "ee99f9c1131358f873531a2d45ac9af9";

let mainContainer = document.getElementById("main-container");
mainContainer.innerHTML = "";

//To convert wind speed to kmph
function convertWindSpeedToKmph(windSpeedMps) {
  // 1 m/s is approximately equal to 3.6 km/h
  const windSpeedKmph = windSpeedMps * 3.6;
  return windSpeedKmph.toFixed(2);
}

//To convert Air pressure to atm
function convertPressureToAtm(pressureMb) {
  // 1 millibar (mb) is equal to 0.000986923267 atm
  const pressureAtm = pressureMb * 0.000986923267;
  return Math.ceil(pressureAtm).toFixed(2);
}

//To convert degree to compass direction
function degreesToCompassDirection(degrees) {
  // Define compass directions and their degree ranges
  const directions = [
    { name: "North", min: 0, max: 22.5 },
    { name: "Northeast", min: 22.5, max: 67.5 },
    { name: "East", min: 67.5, max: 112.5 },
    { name: "Southeast", min: 112.5, max: 157.5 },
    { name: "South", min: 157.5, max: 202.5 },
    { name: "Southwest", min: 202.5, max: 247.5 },
    { name: "West", min: 247.5, max: 292.5 },
    { name: "Northwest", min: 292.5, max: 337.5 },
    { name: "North", min: 337.5, max: 360 },
  ];

  // Find the compass direction for the given degrees
  for (const direction of directions) {
    if (degrees >= direction.min && degrees < direction.max) {
      return direction.name;
    }
  }

  // If the input is out of range (e.g., degrees > 360), return an error message
  return "Invalid Input";
}

async function fetchWeatherData(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    let response = await fetch(url, { method: "GET" });
    let result = await response.json();
    console.log( "response",result)
    return result;
  } catch (error) {
    console.log(error);
  }
}

function getGeoLocation() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position.coords);
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      addDataToUI(lat, lon);
    },
    (error) => {
      alert(error.message);
    }
  );
}

getGeoLocation();

async function addDataToUI(lat, lon) {
  let ans = await fetchWeatherData(lat, lon);

  const timezoneOffsetHours = Math.floor(Math.abs(ans.timezone) / 3600);
  const timezoneOffsetMinutes = Math.abs(ans.timezone) % 3600 / 60;
  
  // Determine the sign of the timezone offset (positive or negative)
  const timezoneSign = ans.timezone >= 0 ? '+' : '-';
  
  // Create a string for the formatted time zone without "GMT"
  const formattedTimezone = `GMT ${timezoneSign}${timezoneOffsetHours}:${String(timezoneOffsetMinutes).padStart(2, '0')}`;
  

  let childContainer = document.createElement("div");
  childContainer.innerHTML = `
    <div class="welcome-container">
      <div class="welcome-row1">
        <h1>Welcome To The Weather App</h1>
        <p>Here is your current location</p>
        <div class="locations">
          <div class="lat">Lat: ${ans.coord.lat}</div>
          <div class="long">Long: ${ans.coord.lon}</div>
        </div>
      </div>
      <div class="welcome-row2">
        <iframe
          src="https://maps.google.com/maps?q=${ans.coord.lat}, ${
    ans.coord.lon
  }&z=15&output=embed"
          frameborder="0"
          style="border: 0"
        ></iframe>
      </div>
    </div>
    <div class="weatherData">
      <h1>Your Weather Data</h1>
      <div class="weather-container">
        <div>Location :  ${ans.name}</div>
        <div>Wind Speed :  ${convertWindSpeedToKmph(ans.wind.speed)} kmph</div>
        <div>Humidity :  ${ans.main.humidity}</div>
        <div>Time Zone :  ${formattedTimezone}</div>
        <div>Pressure:  ${convertPressureToAtm(ans.main.pressure)} atm</div>
        <div>Wind Direction :  ${degreesToCompassDirection(ans.wind.deg)}</div>
        <div>UV Index : 500</div>
        <div>Feels like :  ${Math.floor(ans.main.feels_like)}<sup>o</sup></div>
      </div>
    </div>
  `;

  mainContainer.appendChild(childContainer);
}
