import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';

// Child component for building weather chart within timeOfDay period and sending it up to parent component (Weather)
function WeatherChart({ id, temperatures, timeOfDay, precipProbs, windSpeed }) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    // Creates divisions for time of day - morning, afternoon, and evening
    const filterHoursByTimeOfDay = (timeOfDay) => {
        switch (timeOfDay) {
            case 'morning':
                return [8, 9, 10, 11];
            case 'afternoon':
                return [12, 13, 14, 15, 16];
            case 'evening':
                return [17, 18, 19, 20];
            default:
                return [];
        }
    };

    // Handles data manipulation; creates chart using hourly temperature, precipitation probabilities, and wind speeds; and 
    // destroys charts when necessary to re-render new charts
    useEffect(() => {
        if (temperatures && chartRef.current) {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            const filteredHours = filterHoursByTimeOfDay(timeOfDay);
            const filteredTemperatures = filteredHours.map((hour) => temperatures[hour]);
            const filteredPrecipProbs = filteredHours.map((hour) => precipProbs[hour]);
            const filteredWindSpeeds = filteredHours.map((hour) => windSpeed[hour]);

            const ctx = chartRef.current.getContext('2d');
            chartInstanceRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: filteredHours.map((hour) => `${hour % 12 || 12}:00`),
                    datasets: [
                        {
                            label: 'Temperature (°F)',
                            data: filteredTemperatures,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1,
                        },
                        {
                            label: 'Precipitation Probability',
                            data: filteredPrecipProbs,
                            borderColor: 'rgb(255, 99, 132)',
                            tension: 0.1,
                        },
                        {
                            label: 'Wind Speed (mph)',
                            data: filteredWindSpeeds,
                            borderColor: 'rgb(54, 162, 235)',
                            tension: 0.1,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            suggestedMin: 0,
                            suggestedMax: 100,
                        },
                        x: {
                            title: {
                                display: true,
                                text: `${timeOfDay}`,
                            },
                        },
                    },
                },
            });
        }

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [id, temperatures, timeOfDay, precipProbs, windSpeed]);

    return <canvas id={id} ref={chartRef} width="400" height="400"></canvas>;
}

export default WeatherChart;
