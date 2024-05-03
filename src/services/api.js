import axios from 'axios'; 

// Axios API baseURL
const api = axios.create({
    baseURL: 'https://weather.visualcrossing.com',
});

export default api;