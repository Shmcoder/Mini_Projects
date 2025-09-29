const apiKey = "9c1dd34bea924a47e450ecf154e89074";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const search = document.querySelector(".citytext");
const searchbtn = document.querySelector(".lens");
const weatherIcon = document.querySelector("weather-icon");
async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  var data = await response.json();
  console.log(data);
  document.querySelector(".cityname").innerHTML = data.name.toUpperCase();
  document.querySelector(".txt").innerHTML = Math.round(data.main.temp);
  document.querySelector(".Humidity-output").innerHTML =
    data.main.humidity + " %";
  document.querySelector(".wind-output").innerHTML =
    Math.round(data.wind.speed * 3.6) + " km/h";
  //   console.log(data.weather[0].main);
  if (data.weather[0].main == "Clouds") {
    weatherIcon.src = "image/clear.png";
  } else if (data.weather[0].main == "Clear") {
    weatherIcon.src = "image/clear.png";
  } else if (data.weather[0].main == "rain") {
    weatherIcon.src = "image/rain.png";
  } else if (data.weather[0].main == "Snow") {
    weatherIcon.src = "image/snow.png";
  } else if (data.weather[0].main == "Mist") {
    weatherIcon.src = "image/mist.png";
  } else if (data.weather[0].main == "Drizzle") {
    weatherIcon.src = "image/drizzle.png";
  }
}
searchbtn.addEventListener("click", () => {
  checkWeather(search.value);
});
