import axios from 'axios';

const instance = axios.create({
    baseURL: '',
    headers: {'Content-Type': 'application/json'},
    timeout: 15000,
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('lrc_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('lrc_token');
            localStorage.removeItem('lrc_user');
            if (!globalThis.location.pathname.includes('/login')) {
                globalThis.location.href = '/login?session=expired';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
