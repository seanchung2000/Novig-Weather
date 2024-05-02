import React, { useEffect, useState } from 'react';
import WeatherInfo from './WeatherInfo';
import './App.css';
import api from './api';
import TemperatureChart from './TemperatureCharts';

function Weather() {
    const [location, setLocation] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [upcomingWeather, setUpcomingWeather] = useState(null);
    const [currentTemperatures, setCurrentTemperatures] = useState(null);
    const [upcomingTemperatures, setUpcomingTemperatures] = useState(null);
    const [timeOfDay, setTimeOfDay] = useState('morning');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState('');

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const handleDataFetch = () => {
        setLoading(true);
        setError(null);

        const apiKey = "QBZKZUTLUM6354853SYSBC9MM";
        const endpoint = '/VisualCrossingWebServices/rest/services/timeline';

        // Calculate the date for the upcoming day
        const currentDate = new Date();
        const selectedDayIndex = daysOfWeek.indexOf(selectedDay);
        const currentDayIndex = currentDate.getDay();
        const daysToAdd = selectedDayIndex >= currentDayIndex ? selectedDayIndex - currentDayIndex : 7 - currentDayIndex + selectedDayIndex;
        const selectedDate = new Date(currentDate);
        selectedDate.setDate(currentDate.getDate() + daysToAdd);
        const formattedCurrentDate = selectedDate.toISOString().slice(0, 10);

        // Calculate the date for the upcoming day
        const upcomingDate = new Date(selectedDate);
        upcomingDate.setDate(selectedDate.getDate() + 7);
        const formattedUpcomingDate = upcomingDate.toISOString().slice(0, 10);

        const url = `${endpoint}/${location}/${formattedCurrentDate}/${formattedUpcomingDate}?unitGroup=metric&include=hours%2Cdays%2Ccurrent&key=${apiKey}&contentType=json`;

        api.get(url)
            .then(response => {
                const { days } = response.data;
                const currentTemps = response.data.days[0].hours.map(hour => Math.round(hour.temp * (9 / 5) + 32));
                const upcomingTemps = response.data.days[7].hours.map(hour => Math.round(hour.temp * (9 / 5) + 32));
                setCurrentWeather({
                    date: days[0].datetime,
                    temperature: days[0].temp,
                    description: days[0].description,
                    wind: days[0].windspeed,
                    conditions: days[0].conditions,
                    rain: days[0].precipprob
                });
                setUpcomingWeather({
                    date: days[7].datetime,
                    temperature: days[7].temp,
                    description: days[7].description,
                    wind: days[7].windspeed,
                    conditions: days[7].conditions,
                    rain: days[7].precipprob
                });
                setCurrentTemperatures(currentTemps);
                setUpcomingTemperatures(upcomingTemps);
            })
            .catch(error => {
                setError('Error fetching data');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleTimeOfDayChange = (e) => {
        setTimeOfDay(e.target.value);
    };

    const handleDayChange = (e) => {
        setSelectedDay(e.target.value);
    };

    useEffect(() => {
        handleDataFetch();
    }, [selectedDay]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleDataFetch();
        }
    };

    const handleButtonClick = () => {
        handleDataFetch();
    };

    function getOrdinalSuffix(day) {
        if (day >= 11 && day <= 13) {
            return 'th';
        }

        switch (day % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    }

    return (
        <div>
            <h1>Weather Forecasts</h1>
            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter location"
            />
            <button onClick={handleButtonClick}>Fetch Data</button>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <select value={selectedDay} onChange={handleDayChange}>
                {daysOfWeek.map((day, index) => (
                    <option key={index} value={day}>{day}</option>
                ))}
            </select>

            <h2>This {selectedDay} the {parseInt(currentWeather.date.slice(8, 10), 10)}{getOrdinalSuffix(parseInt(currentWeather.date.slice(8, 10), 10))}</h2>
            {currentWeather && <WeatherInfo weather={currentWeather} />}
            <h2>This {selectedDay} the {parseInt(currentWeather.date.slice(8, 10), 10)}{getOrdinalSuffix(parseInt(currentWeather.date.slice(8, 10), 10))}</h2>
            {upcomingWeather && <WeatherInfo weather={upcomingWeather} />}

            <select value={timeOfDay} onChange={handleTimeOfDayChange}>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
            </select>
            <TemperatureChart
                id="current-temperature-chart"
                temperatures={currentTemperatures}
                timeOfDay={timeOfDay}
            />
            <TemperatureChart
                id="upcoming-temperature-chart"
                temperatures={upcomingTemperatures}
                timeOfDay={timeOfDay}
            />
        </div>
    );
}

export default Weather;

