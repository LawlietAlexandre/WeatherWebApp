
const API_KEY = 'd5df15b8324a1979c1ddc650acb1f631';

const onLoad = () => {
    navigator.geolocation.getCurrentPosition(WeatherData);
}

//Obtener datos de OpenWeather API
const WeatherData = position => {
    const {latitude, longitude} = position.coords;
    fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(currentWeather => setCurrentWeather(currentWeather));
        
    fetch(`http://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(predictionWeather => predictionWeatherData(predictionWeather));
}

const predictionWeatherData = predictionWeather => {
    console.log(predictionWeather);
    const predWeathArray = predictionWeather.list;
    const predictionLastIndex = predWeathArray.length - 1;

    const arrayDays = [[], [], [], [], []];
    const daysLastIndex = arrayDays.length - 1;
    const weekDays = ['Sun', 'Mon', 'Tus', 'Wed', 'Thu', 'Fri', 'Sat'];

    let todayDay = new Date().getDate();
    const firstDay = extractDay(predWeathArray[0]);
    const date = new Date();

    function findMinMaxTemperature(daysArray){
        let maxTemp = daysArray[0].main.temp_max;
        let minTemp = daysArray[0].main.temp_min;

        daysArray.forEach(data => {
                const temp1 = data.main.temp_max;
                const temp2 = data.main.temp_min;
                if(temp1 > maxTemp) maxTemp = temp1
                if(temp2 < minTemp) minTemp = temp2
        });
        return{maxTemp, minTemp}
    }

    function extractDay(object){
        const date = new Date(object.dt_txt);
        const day = date.getDate();
        return day;
    }

    function fillDays(dayDate, stop, position1, position2, dayArray){
        for (let i = 0; i < 8; i++) {
            if(position1 <= predictionLastIndex && dayDate == extractDay(predWeathArray[position1])){
                dayArray[i] = predWeathArray[position1];
                position1++;
            }
        }
        dayDate++;
        if(position1 < predictionLastIndex && dayDate <= extractDay(predWeathArray[predictionLastIndex]) && stop < daysLastIndex){
            position2++
            stop++;
            fillDays(dayDate, stop, position1, position2, arrayDays[position2]);
        }
    }

    function setDataSecondary(dataArray, i, day){
        let weekDay = document.getElementById(`weekDay${i}`);
        let maxmin = document.getElementById(`maxmin${i}`);
        let icon = document.getElementById(`icon${i}`);
        weekDay.textContent = weekDays[day];
        maxmin.textContent = Math.round(findMinMaxTemperature(dataArray).maxTemp) + '° - ' + Math.round(findMinMaxTemperature(dataArray).minTemp) + '°';
        icon.src = `https://openweathermap.org/img/wn/${dataArray[0].weather[0].icon}.png`;
    }

    if(todayDay == firstDay){
        let position = 1;
        let end = false;
        do {
            if(todayDay == extractDay(predWeathArray[position])){
                position++;
            }else{
                fillDays(extractDay(predWeathArray[position]), 0, position, 0, arrayDays[0]);
                end = true;
            }
        } while (end == false);
    }else{
        fillDays(firstDay, 0, 0, 0, arrayDays[0]);
    }

    for (let i = 0; i < arrayDays.length; i++) {
        todayDay++;
        date.setDate(todayDay);
        setDataSecondary(arrayDays[i], i+1, date.getDay());
    }
    // console.log(arrayDays);
}

const setCurrentWeather = currentWeather => {
    // console.log(currentWeather);
    let temperatureValue = document.getElementById('temperatureValue');
    let temperatureDescription = document.getElementById('temperatureDescription');
    let location = document.getElementById('location');
    let humidity = document.getElementById('humidity');
    let windSpeed = document.getElementById('windSpeed');
    let dinamicIcon = document.getElementById('dinamicIcon');

    temperatureValue.textContent = Math.round(currentWeather.main.temp) + '° C';
    temperatureDescription.textContent = currentWeather.weather[0].description.toUpperCase();
    location.textContent = currentWeather.name;
    humidity.textContent = currentWeather.main.humidity + ' g/m³';
    windSpeed.textContent = currentWeather.wind.speed + ' m/s';
    dinamicIcon.src = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`;
}