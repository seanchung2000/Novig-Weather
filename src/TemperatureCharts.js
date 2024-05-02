import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function TemperatureChart({ id, temperatures, timeOfDay }) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

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

    useEffect(() => {
        if (temperatures && chartRef.current) {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            const filteredHours = filterHoursByTimeOfDay(timeOfDay);
            const filteredTemperatures = filteredHours.map((hour) => temperatures[hour]);

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
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: false,
                        },
                        x: {
                            title: {
                                display: true,
                                text: `${timeOfDay}`
                            }
                        }
                    },
                },
            });
        }

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [id, temperatures, timeOfDay]);

    return <canvas id={id} ref={chartRef} width="200" height="200"></canvas>;
}


export default TemperatureChart;
