import axios from "axios";

const api = axios.create({
<<<<<<< Updated upstream
    baseURL: "https://8944-2405-4803-d74c-b090-2cf2-e14b-9a4e-654c.ngrok-free.app",
=======
    baseURL: "https://8944-2405-4803-d74c-b090-2cf2-e14b-9a4e-654c.ngrok-free.app/",
>>>>>>> Stashed changes
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            fullURL: `${config.baseURL}${config.url}`,
            headers: config.headers,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('❌ API Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export default api;