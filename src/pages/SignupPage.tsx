import React, { useState } from 'react';
import { signUp } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [successMessage, setSucessMessage] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signUp({ username, password });
            setSucessMessage(true);
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        } catch (error) {
            console.error('Invalid credentials', error);
        }
    };

    return (
        <form className="block mt-16 max-w-md mx-auto text-center font-sans"onSubmit={handleSubmit}>
            <h1 className="mb-8 text-4xl font-bold">Sign Up</h1>
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
            <label className='text-xs font-bold mb-2'>
                At least 8 digits required. 1 upper letter, number and character.
            </label>
            <button className='w-full p-4 border rounded-lg shadow-md font-semibold text-lg bg-emerald-500 hover:bg-emerald-700 text-white'>
                Submit
            </button>
            {successMessage && (
                <div className="text-center text-xl font-bold mt-4">
                    <p>Boom. You're signed up. 🎉</p>
                </div>
            )}

        </form>
    );
};
