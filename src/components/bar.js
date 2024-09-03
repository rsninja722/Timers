class Bar {
    static updateTime() {
        let date = new Date();
        document.getElementById("time").innerText = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
    }

    static updateDay() {
        let date = new Date();
        document.getElementById("day").innerText = date.toLocaleDateString("en-US", { weekday: "long" });
    }

    static updateDate() {
        let date = new Date();
        document.getElementById("date").innerText = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }

    static updateWeather() {
        let weatherURL = "https://wttr.in/?format=j1";

        fetch(weatherURL)
            .then((response) => response.json())
            .then(function (data) {

                let cur = data.current_condition[0];

                console.log(cur);

                // description
                document.getElementById("word").innerText = `${cur.weatherDesc[0].value} |`;

                // temperature
                let hourly = data.weather[0].hourly;

                let min = 100; // code works until the earth is void of all life
                let max = -100;

                // find max and min temperatures
                for (let i = 0; i < hourly.length; i++) {
                    min = Math.min(parseInt(hourly[i].tempC), min);
                    max = Math.max(parseInt(hourly[i].tempC), max);
                }

                document.getElementById("temp").innerText = `${cur.temp_C}° H: ${max}° L: ${min}° |`;

                // precipitation
                document.getElementById("precip").innerText = `🌧 ${cur.precipMM}mm |`;

                // wind, cloud cover/visibility
                document.getElementById("extra").innerText = `${cur.windspeedKmph} km/h ${cur.winddir16Point} | ${cur.visibility}👁 | ${cur.cloudcover}%☁ | ${cur.humidity}% humidity`;

            });
    }

    static onLoad() {
        Bar.updateTime();
        setInterval(Bar.updateTime, 1000);

        Bar.updateDay();
        Bar.updateDate();
        Bar.updateWeather();

        document.getElementById("button-update-bar").addEventListener("click", () => {
            Bar.updateDay();
            Bar.updateDate();
            Bar.updateWeather();
        });
    }
}

export default Bar;
