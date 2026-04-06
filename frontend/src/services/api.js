import axios from 'axios';

const api = axios.create({
    // تأكد إن ده الـ URL اللي زميلك مشغل عليه السيرفر (غالباً 8000)
    baseURL: 'http://127.0.0.1:8000/api/' 
});

// "الإنترسيبتور": وظيفتة يحط مفتاح الدخول (Token) في رأس كل طلب (Headers)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;