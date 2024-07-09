import axios from 'axios';
import { Task } from '../types/Task';
import Cookies from 'js-cookie'

const API_URL = import.meta.env.VITE_TASKS_API_URL;

const getAuthHeader = () => {
    const accessToken = Cookies.get('accessToken');
    return { headers: { Authorization: `Bearer ${accessToken}` } };
};


export const deleteTask = async(id : string) : Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`, getAuthHeader());
        console.log('API',`${API_URL}/${id}`);
    } catch(error) {
        console.error('Failed to delete task');
        throw error;
    }
}

export const getTasks = async (): Promise<Task[]> => {
    try {
        const response = await axios.get(API_URL, getAuthHeader());
        return response.data;
    } catch(error) {
        console.log(error);
        throw error;
    }

};

export const createTask = async (title: string, description: string): Promise<Task> => {
    try {
        const response = await axios.post(API_URL, { title, description }, getAuthHeader());
        return response.data;
    }catch(error) {
        console.log(error);
        throw error;
    }
};
