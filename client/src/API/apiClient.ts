import axios, { AxiosInstance } from 'axios';

export const axiosClient: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
    timeout: 10 * 1000, 
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    },
});