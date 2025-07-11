import axios from "axios";

const api = axios.create({
    baseURL: "https://02d4ea8a290b.ngrok-free.app",
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
api.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', response);
        return response;
    },
    (error) => {
        console.error('❌ API Error:', error);
        
        // Special handling for video call errors
        if (error.config?.url?.includes('video-calls')) {
            console.error('🎥 Video Call API Error Details:', {
                url: error.config.url,
                method: error.config.method,
                data: error.config.data,
                status: error.response?.status,
                statusText: error.response?.statusText,
                responseData: error.response?.data,
                headers: error.response?.headers
            });
        }
        
        return Promise.reject(error);
    }
);
export default api;