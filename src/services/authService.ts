import axios from 'axios';
import { AuthCredentials, } from '../types/AuthCredentials';
import  Cookies  from 'js-cookie'
import { AuthResponse } from '../types/AuthResponse';

const API_URL = import.meta.env.VITE_AUTH_API_URL;

export const signIn = async (credentials: AuthCredentials): Promise<AuthResponse> => {
    try {
        const response = await axios.post<AuthResponse>(`${API_URL}/signin`, credentials, { withCredentials: true });
        const accessToken = response.data.accessToken;
        saveToken(accessToken);
        console.log(accessToken);
        return response.data;
    } catch (error) {
        console.error("Failed to sign in:", error);
        throw error;
    }
};

export const signUp = async (credentials: AuthCredentials) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, credentials);
        return response.data;
    }catch(error) {
        console.log("Failed to sign up", error);
        throw error;
    }
};

const saveToken = (accessToken : string): void  => {
    Cookies.set('accessToken', accessToken);
}
