import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/'); // Navigate back to Homepage
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const response = await axios.post('/api/user/login', { email, password }); // Update with your API endpoint
            // Handle successful login (e.g., store token, redirect user)
            console.log('Login successful:', response.data);
            navigate('/'); // Redirect to dashboard or any other page after login
        } catch (err) {
            console.error('Login failed:', err);
            setError('Invalid email or password'); // Set error message if login fails
        }
    };

    return (
        <div className="container mx-auto h-screen flex items-center justify-center">
            <div className="bg-gray-700 w-full max-w-lg p-8 rounded-lg shadow-lg">
                <h2 className="text-white text-2xl mb-4">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 text-gray-800 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 text-gray-800 rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 w-full"
                    >
                        Login
                    </button>
                </form>

                {/* Back Button */}
                <button
                    onClick={handleBackClick}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300 mt-4"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default Login;
