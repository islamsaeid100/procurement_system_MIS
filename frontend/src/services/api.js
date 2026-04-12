import axios from 'axios';

const api = axios.create({
    // تم تغيير اللينك من localhost إلى سيرفر Render الحقيقي
    baseURL: 'https://procurement-system-mis-1.onrender.com/api/',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;