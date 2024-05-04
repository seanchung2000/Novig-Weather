import React, { useEffect, useState } from 'react';
import WeatherInfo from './WeatherInfo';
import '../styles/Styles.css';
import api from '../services/api';
import WeatherChart from './WeatherChart';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

import locationMarkerImage from '../assets/location-marker.png';
import clockImage from '../assets/clock.png';
import rightButton from '../assets/right-arrow.png';
import leftButton from '../assets/left-arrow.png';

// Parent component that manages behavior of child components: WeatherInfo, TemperatureCharts, api
function Weather() {

    // State variables necessary to keep track of changing information and update user interface
    const [location, setLocation] = useState('Manhattan');
    const [currentTemperatures, setCurrentTemperatures] = useState(null);
    const [upcomingTemperatures, setUpcomingTemperatures] = useState(null);
    const [currentPrecipProbs, setCurrentPrecipProbs] = useState(null);
    const [upcomingPrecipProbs, setUpcomingPrecipProbs] = useState(null);
    const [currentWindSpeed, setCurrentWindSpeed] = useState(null);
    const [upcomingWindSpeed, setUpcomingWindSpeed] = useState(null);
    const [timeOfDay, setTimeOfDay] = useState('morning');
    const [selectedDay, setSelectedDay] = useState('Friday');
    const [currentWeather, setCurrentWeather] = useState({ date: new Date().toISOString().slice(0, 10) });
    const [upcomingWeather, setUpcomingWeather] = useState({ date: new Date().toISOString().slice(0, 10) });
    const [weatherOffset, setWeatherOffset] = useState(0);

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


    // Handles pulling the data from API endpoint and manipulating data
    const handleDataFetch = () => {
        const apiKey = "QBZKZUTLUM6354853SYSBC9MM";
        const endpoint = '/VisualCrossingWebServices/rest/services/timeline';

        // Calculate the date for the selected day
        const currentDate = new Date();
        const selectedDayIndex = daysOfWeek.indexOf(selectedDay);
        const currentDayIndex = currentDate.getDay();
        const daysToAdd = selectedDayIndex >= currentDayIndex ? selectedDayIndex - currentDayIndex : 7 - currentDayIndex + selectedDayIndex;
        const selectedDate = new Date(currentDate);
        selectedDate.setDate(currentDate.getDate() + daysToAdd + weatherOffset);
        const formattedCurrentDate = selectedDate.toISOString().slice(0, 10);

        // Calculate the date for the upcoming day
        const upcomingDate = new Date(selectedDate);
        upcomingDate.setDate(selectedDate.getDate() + 7);
        const formattedUpcomingDate = upcomingDate.toISOString().slice(0, 10);

        const url = `${endpoint}/${location}/${formattedCurrentDate}/${formattedUpcomingDate}?unitGroup=us&include=hours%2Cdays%2Ccurrent&key=${apiKey}&contentType=json`;

        // Pull data from API endpoint using Axios in api.js component and manipulate based on user requirements
        api.get(url)
            .then(response => {
                const { days } = response.data;
                const currentTemps = response.data.days[0].hours.map(hour => Math.round(hour.temp));
                const upcomingTemps = response.data.days[7].hours.map(hour => Math.round(hour.temp));
                const currentPrecip = response.data.days[0].hours.map(hour => hour.precipprob);
                const upcomingPrecip = response.data.days[7].hours.map(hour => hour.precipprob);
                const currentWind = response.data.days[0].hours.map(hour => hour.windspeed);
                const upcomingWind = response.data.days[7].hours.map(hour => hour.windspeed);
                setCurrentWeather({
                    date: days[0].datetime,
                    temperature: days[0].temp,
                    wind: days[0].windspeed,
                    conditions: days[0].conditions,
                    rain: days[0].precipprob,
                });
                setUpcomingWeather({
                    date: days[7].datetime,
                    temperature: days[7].temp,
                    wind: days[7].windspeed,
                    conditions: days[7].conditions,
                    rain: days[7].precipprob,
                });
                setCurrentTemperatures(currentTemps);
                setUpcomingTemperatures(upcomingTemps);
                setCurrentPrecipProbs(currentPrecip);
                setUpcomingPrecipProbs(upcomingPrecip);
                setCurrentWindSpeed(currentWind);
                setUpcomingWindSpeed(upcomingWind);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    // Handler for when user changes time period of day to account for new weather information
    const handleTimeOfDayChange = (e) => {
        setTimeOfDay(e.target.value);
    };

    // Handler for when user changes day of the week so that information matches accordingly
    const handleDayChange = (e) => {
        setSelectedDay(e.target.value);
    };

    useEffect(() => {
        handleDataFetch();
    }, [selectedDay, weatherOffset]);

    // Handler for when user searches for a different location in search bar
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleDataFetch();
        }
    };

    // Used to obtain ordinal suffix for current and upcoming dates
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

    // Handles date (offsets by 7 days) if user looks forward or backward by week to display correct weather information
    const handleWeatherChange = (offset) => {
        const newOffset = weatherOffset + offset;
        const maxOffset = 30;
        if (newOffset >= 0 && newOffset <= maxOffset) {
            setWeatherOffset(newOffset);
        }
    };

    return (
        <div className="main">
            <div className="box">
                <div className="top-flex">
                    <div className="search">
                        <img src={locationMarkerImage} className="location-marker-image" alt="location marker" height="25" width="25" ></img>
                        <TextField id="standard-basic" variant="standard" value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter location" />
                    </div>
                    <div className="selectors">
                        <img src={clockImage} className="clock-image" alt="clock" height="25" width="25"></img>

                        <FormControl halfWidth>
                            <InputLabel id="demo-simple-select-label">Day</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedDay}
                                label="Day"
                                onChange={handleDayChange}
                            >
                                {daysOfWeek.map((day, index) => (
                                    <MenuItem key={index} value={day}>Every {day}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl halfWidth>
                            <InputLabel id="demo-simple-select-label">Time of Day</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={timeOfDay}
                                label="Time of Day"
                                onChange={handleTimeOfDayChange}
                            >
                                <MenuItem value="morning">Morning</MenuItem>
                                <MenuItem value="afternoon">Afternoon</MenuItem>
                                <MenuItem value="evening">Evening</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <hr></hr>
                <div className="bottom-flex">
                    <input type="image" src={leftButton} onClick={() => handleWeatherChange(-7)} className="nav-button" />
                    <div className="weather">
                        <div className="current-weather">
                            {currentWeather && currentWeather.date < new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10) && (
                                <h2 className="current-weather-header"> This {selectedDay} the {parseInt(currentWeather.date.slice(8, 10), 10)}{getOrdinalSuffix(parseInt(currentWeather.date.slice(8, 10), 10))}</h2>
                            )}
                            {currentWeather && currentWeather.date >= new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10) && (
                                <h2 className="upcoming-weather-header"> Next {selectedDay} the {parseInt(currentWeather.date.slice(8, 10), 10)}{getOrdinalSuffix(parseInt(currentWeather.date.slice(8, 10), 10))}</h2>
                            )}
                            {currentWeather && <WeatherInfo weather={currentWeather} />}
                            <WeatherChart
                                id="current-temperature-chart"
                                temperatures={currentTemperatures}
                                timeOfDay={timeOfDay}
                                precipProbs={currentPrecipProbs}
                                windSpeed={currentWindSpeed}
                            />

                        </div>
                            
                        <div className="upcoming-weather">
                            {upcomingWeather && upcomingWeather.date === new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10) && (
                                <h2 className="upcoming-weather-header"> Next {selectedDay} the {parseInt(upcomingWeather.date.slice(8, 10), 10)}{getOrdinalSuffix(parseInt(upcomingWeather.date.slice(8, 10), 10))}</h2>
                            )}
                            {upcomingWeather && upcomingWeather.date !== new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10) && (
                                <h2 className="upcoming-weather-header"> {selectedDay} the {parseInt(upcomingWeather.date.slice(8, 10), 10)}{getOrdinalSuffix(parseInt(upcomingWeather.date.slice(8, 10), 10))}</h2>
                            )}
                            {upcomingWeather && <WeatherInfo weather={upcomingWeather} />}
                            <WeatherChart
                                id="upcoming-temperature-chart"
                                temperatures={upcomingTemperatures}
                                timeOfDay={timeOfDay}
                                precipProbs={upcomingPrecipProbs}
                                windSpeed={upcomingWindSpeed}
                            />
                        </div>
                    </div>
                    <input type="image" src={rightButton} onClick={() => handleWeatherChange(7)} className="nav-button" />
                </div>
            </div>
        </div>
    );
}

export default Weather;