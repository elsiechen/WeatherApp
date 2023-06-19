const weatherBtn = document.querySelector('#weatherBtn');
weatherBtn.addEventListener('click', () => {
    let locationInput = document.querySelector('#locationInput');
    let errorField = document.querySelector('.error');

    // Form validation
    errorField.textContent = '';
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
        console.log(typeof getData);
    } catch(err) {
        console.log(err);
    }
}

fetchWeather('taipei');