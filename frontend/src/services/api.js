// Create a standalone instance of axios
import axios from 'axios';

// Use Environment Variable if available, otherwise localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;