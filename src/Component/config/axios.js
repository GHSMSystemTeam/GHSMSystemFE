import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
    baseURL: "https://d8a2-2405-4803-d746-3e30-db5-7bdb-cc59-bbdc.ngrok-free.app/",
=======
    baseURL: "https://d8a2-2405-4803-d746-3e30-db5-7bdb-cc59-bbdc.ngrok-free.app",
>>>>>>> b2545099bc5c38ee77f6cf9eaa5326347abfd158
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