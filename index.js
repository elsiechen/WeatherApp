async function fetchWeather(location) {
    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=0f44ee531494426cb6b20040231306&q=${location}`;
        const response = await fetch(url);
        const getData = await response.json();
        if (getData.error) {
            throw Error(getData.error.message);
        };
        console.log(getData);
    } catch(err) {
        console.log(err);
    }
}

fetchWeather('taipei');