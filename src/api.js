import axios from 'axios'; 

const api = axios.create({
    baseURL: 'https://weather.visualcrossing.com',
});

export default api;