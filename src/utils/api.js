import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://mysocial-app-backend-iw99.onrender.com/',
});

export default api;
