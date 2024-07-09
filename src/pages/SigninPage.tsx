import React, { useState } from 'react';
import { signIn } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signIn({ username, password });
            navigate('/');
        } catch (error) {
            console.error('Invalid credentials', error);
        }
    };

    return (
        <form className="block mt-16 max-w-md mx-auto text-center font-sans"onSubmit={handleSubmit}>
            <h1 className="mb-8 text-4xl font-bold">Sign In</h1>
            <input type="text" 
                   value={username} 
                   onChange={(e) => setUsername(e.target.value)} 
                   required
                   className="rounded-lg w-full p-4 border shadow-md mb-2"
                   placeholder='Enter your username'
                   />
            <input type="password" 
                   value={password} 
                   onChange={(e) => setPassword(e.target.value)} 
                   required
                   className="w-full p-4 border rounded-lg shadow-md mb-2"
                   placeholder='Enter your password'
                   />
            <button className='w-full p-4 border rounded-lg shadow-md font-semibold text-lg bg-emerald-500 hover:bg-emerald-700 text-white'>
                Submit
            </button>
        </form>
    );
};
