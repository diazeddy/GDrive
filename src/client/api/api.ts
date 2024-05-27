import axios from "axios";

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const login = (username: string, password: string) => {
    return api.post('/login', {username, password});
}