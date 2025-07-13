import axios from "axios";

const api = axios.create({
    baseURL: "https://21b28a7fc203.ngrok-free.app",
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

// Enhanced error logging for video call debugging
api.interceptors.request.use(
    (config) => {
        // Add authentication token to all requests
        const authToken = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        
        // Special logging for video call APIs
        if (config.url?.includes('video-calls')) {
            console.log('🎥 Video Call API Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                fullURL: `${config.baseURL}${config.url}`,
                headers: config.headers,
                data: config.data,
                params: config.params
            });
        }
        
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
export default api;