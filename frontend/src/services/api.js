<<<<<<< HEAD
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

=======
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        // تأكد إن السطر ده مكتوب صح Authorization و Bearer
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
});

>>>>>>> 0f69498e7aae3db51c1316b76db8a4a800ea3b4f
export default api;