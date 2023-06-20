const weatherBtn = document.querySelector('#weatherBtn');
const toggleBtn = document.querySelector('.toggle');

toggleBtn.addEventListener('click', toggleTemp);
weatherBtn.addEventListener('click', () => {
    let locationInput = document.querySelector('#locationInput');
    let errorField = document.querySelector('.inputError');
    let searchField = document.querySelector('.searchError');

    // Form validation
    errorField.textContent = '';
    searchField.textContent = '';
    if (locationInput.validity.valueMissing) {
        errorField.textContent = 'You need to enter something to search for.';
        return;
    }
    // Fetch data
    fetchWeather(locationInput.value);
});

async function fetchWeather(location) {
    try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=0f44ee531494426cb6b20040231306&q=${location}`;
        const response = await fetch(url);
        const getData = await response.json();
        if (getData.error) {
            throw Error(getData.error.message);
        };
        console.log(getData);
        // Render current
        document.querySelector('.city').innerHTML = `${ getData.location.name }, ${getData.location.country}`;
        document.querySelector('.date').innerHTML = getData.location.localtime;
        document.querySelector('.description').innerHTML = getData.current.condition.text;
        document.querySelector('.temp').innerHTML = `${ getData.current.temp_c }.0 &#8451;`;
        // document.querySelector('.temp_f').innerHTML = `${ getData.current.temp_f } &#8457;`;
        document.querySelector('.weatherIcon').src = getData.current.condition.icon;
        
        const f = tempConverter(document.querySelector('.temp').innerHTML);
        console.log(f);
        console.log(getData.current.temp_f)

        document.querySelector('.feel').innerHTML = `${ getData.current.feelslike_c } &#8451;`;
        document.querySelector('.humidity').innerHTML = `${ getData.current.humidity } %`;
        document.querySelector('.uv').innerHTML = getData.current.uv;
        document.querySelector('.wind').innerHTML = `${getData.current.wind_kph
        } km/h`;
        
        uvInfo();
        
        // Render hour
        const hourArray = getData['forecast']['forecastday'][0]['hour'];
        const hourContainer = document.querySelector('.hourContainer');
        const nowHour = getHour(getData.location.localtime);

        for (let i in hourArray) {
            const displayHour = getHour(hourArray[i].time);
            if(nowHour <= displayHour) {
                const hourSubContainer = document.createElement('div');
                const hour = document.createElement('div');
                const weatherImg = document.createElement('img');
                const chanceOfRain = document.createElement('div');
                const hourTemp = document.createElement('div');
                
                hourSubContainer.classList.add('hourSubContainer');
                hour.classList.add('hour');
                weatherImg.classList.add('weatherImg');
                chanceOfRain.classList.add('chanceOfRain');
                hourTemp.classList.add('hourTemp');

                hour.innerHTML = converter(displayHour);
                weatherImg.src = hourArray[i].condition.icon;
                chanceOfRain.innerHTML = hourArray[i].chance_of_rain === 0 ?
                     '' : `${ hourArray[i].chance_of_rain } %`;
                hourTemp.innerHTML = `${ hourArray[i].temp_c } &#8451;`;

                hourSubContainer.appendChild(hour);
                hourSubContainer.appendChild(hourTemp);
                hourSubContainer.appendChild(weatherImg);
                hourSubContainer.appendChild(chanceOfRain);
                hourContainer.appendChild(hourSubContainer);
            }
        }
    } catch(err) {
        console.log(err);
        document.querySelector('.searchError').innerHTML = err;
    }
}

function uvInfo() {
    // uv info
    let uvIndex = parseInt(document.querySelector('.uv').innerHTML);
    let uvInfo = document.querySelector('.uvInfo');
    if(uvIndex >= 0 && uvIndex <= 2) {
        uvInfo.innerHTML = '<strong>Low</strong>: <br> No protection needed. You can safely stay outside using minimal sun protection.';
    } else if(uvIndex >= 3 && uvIndex <= 7) {
        uvInfo.innerHTML = '<strong>Moderate to High</strong>: <br> Protection needed. When outside, generously apply broad-spectrum SPF-15 or higher sunscreen on exposed skin, and wear protective clothing, a wide-brimmed hat, and sunglasses.';
    } else {
        uvInfo.innerHTML = '<strong>Very High to Extreme</strong>: <br> Extra protection needed. Be careful outside, seek shade and wear protective clothing, a wide-brimmed hat, and sunglasses, and generously apply a minimum of  SPF-15, broad-spectrum sunscreen on exposed skin.';
    }
}

function getHour(time) {
    const array = time.split(' ');
    const hour = array[1].slice(0,2);
    return hour;
}

function converter(time) {
    if(time < 12) return `${ time } am`;
    else return `${ time } pm`;
}

function tempConverter(temp) {
    const number = temp.slice(0,4);
    // degree of Celsius
    if(temp.includes('℃')) {
        let fahrenheit = (parseFloat(number)* 9 / 5 + 32).toFixed(1);
        console.log(fahrenheit)
        return `${ fahrenheit } ℉`;
    } else {
        let celsius = ((parseFloat(number) - 32) * 5 / 9).toFixed(1);
        console.log(celsius)
        // let rounded = celsius.toFixed(1);
        return `${ celsius } ℃`;
    }
}

function toggleTemp() {
    let temp = document.querySelector('.temp');
    let feel = document.querySelector('.feel');
    let hourTemps = document.querySelectorAll('.hourTemp');
    
    temp.innerHTML = tempConverter(temp.innerHTML);
    feel.innerHTML = tempConverter(feel.innerHTML);
    hourTemps.forEach(hourTemp => {
        hourTemp.innerHTML = tempConverter(hourTemp.innerHTML);
    })
}

fetchWeather('taipei');