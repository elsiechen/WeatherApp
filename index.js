const weatherBtn = document.querySelector('#weatherBtn');
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
        const url = `https://api.weatherapi.com/v1/current.json?key=0f44ee531494426cb6b20040231306&q=${location}`;
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
        document.querySelector('.temp').innerHTML = `${ getData.current.temp_c } &#8451;`;
        // document.querySelector('.temp_f').innerHTML = `${ getData.current.temp_f } &#8457;`;
        document.querySelector('.weatherIcon').src = getData.current.condition.icon;
        
        document.querySelector('.feel').innerHTML = `${ getData.current.feelslike_c } &#8451;`;
        document.querySelector('.humidity').innerHTML = `${ getData.current.humidity } %`;
        document.querySelector('.uv').innerHTML = getData.current.uv;
        document.querySelector('.wind').innerHTML = `${getData.current.wind_kph
        } km/h`;
        
        uvInfo();
        
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
        uvInfo.innerHTML = 'Low: No protection needed. You can safely stay outside using minimal sun protection.';
    } else if(uvIndex >= 3 && uvIndex <= 7) {
        uvInfo.innerHTML = 'Moderate to High: Protection needed. When outside, generously apply broad-spectrum SPF-15 or higher sunscreen on exposed skin, and wear protective clothing, a wide-brimmed hat, and sunglasses.';
    } else {
        uvInfo.innerHTML = 'Very High to Extreme: Extra protection needed. Be careful outside, seek shade and wear protective clothing, a wide-brimmed hat, and sunglasses, and generously apply a minimum of  SPF-15, broad-spectrum sunscreen on exposed skin.';
    }
}

fetchWeather('taipei');