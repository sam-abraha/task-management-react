import axios from 'axios';
import { Task } from '../types/Task';
import Cookies from 'js-cookie'

const API_URL = import.meta.env.VITE_TASKS_API_URL;

const getAuthHeader = () => {
    const accessToken = Cookies.get('accessToken');
    return { headers: { Authorization: `Bearer ${accessToken}` } };
};

export const getTasks = async (): Promise<Task[]> => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
};

export const createTask = async (title: string, description: string): Promise<Task> => {
    const response = await axios.post(API_URL, { title, description }, getAuthHeader());
    return response.data;
};
