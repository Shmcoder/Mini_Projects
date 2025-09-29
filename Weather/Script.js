        const apiKey = "9c1dd34bea924a47e450ecf154e89074";
        const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
        const search = document.querySelector(".citytext");
        const searchbtn = document.querySelector(".lens");
        // const weatherIcon = document.querySelector("weather-icon");
        async function checkWeather(city) {
            const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
            var data = await response.json();
            console.log(data);
            document.querySelector(".cityname").innerHTML = (data.name).toUpperCase();
            document.querySelector(".txt").innerHTML = Math.round(data.main.temp);
            document.querySelector(".Humidity-output").innerHTML = data.main.humidity + " %";
            document.querySelector(".wind-output").innerHTML = Math.round(data.wind.speed * 3.6) + " km/h";
            // if (data.weather[0].main == "Clouds") {
            //     weatherIcon.src = "image/clouds.png";
            // }
        }
        searchbtn.addEventListener("click", () => {
            checkWeather(search.value);
        });