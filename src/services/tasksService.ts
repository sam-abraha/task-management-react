import axios from 'axios';
import { Task, TaskStatus } from '../types/Task';
import Cookies from 'js-cookie'

const API_URL = import.meta.env.VITE_TASKS_API_URL;

const getAuthHeader = () => {
    const accessToken = Cookies.get('accessToken');
    return { headers: { Authorization: `Bearer ${accessToken}` } };
};


export const deleteTask = async(id : string) : Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    } catch(error) {
        console.error('Failed to delete task',error);
        throw error;
    }
}

export const getTasks = async (): Promise<Task[]> => {
    try {
        const response = await axios.get(API_URL, getAuthHeader());
        return response.data;
    } catch(error) {
        console.log('Failed to fetch tasks',error);
        throw error;
    }

};

export const createTask = async (title: string, description: string): Promise<Task> => {
    try {
        const response = await axios.post(API_URL, { title, description }, getAuthHeader());
        return response.data;
    }catch(error) {
        console.log('Failed to create a task',error);
        throw error;
    }
};


export const updateTaskStatus = async (id : string, status : TaskStatus) : Promise<Task> => {
    try {
        const response = await axios.patch(`${API_URL}/${id}/status`, { status }, getAuthHeader());
        return response.data;
    } catch(error) {
        console.log('Failed to update task',error);
        throw error;
    }
}