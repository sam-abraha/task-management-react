import axios from 'axios';
import { AuthCredentials } from '../types/AuthCredentials';

const API_URL = import.meta.env.VITE_AUTH_API_URL;

export const signIn = async (credentials: AuthCredentials) => {
    const response = await axios.post(`${API_URL}/signin`, credentials, { withCredentials : true });
    return response.data;
};

export const signUp = async (credentials: AuthCredentials) => {
    const response = await axios.post(`${API_URL}/signup`, credentials);
    return response.data;
};
