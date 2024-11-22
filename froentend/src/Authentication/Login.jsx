import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { gsap } from 'gsap'; // Import GSAP

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Check if the user is already logged in
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.token) {
            navigate('/chat'); // Redirect to chat if the user is already logged in
        }

        // GSAP animations when component mounts
        gsap.fromTo(
            '.login-container',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.5, ease: 'power3.out' }
        );
        gsap.fromTo(
            '.login-form',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 }
        );
        gsap.fromTo(
            '.back-btn',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
        );

        gsap.fromTo(
            '.email-label, .email-input',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: 'power3.out', delay: 0.5 }
        );

        gsap.fromTo(
            '.password-label, .password-input',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: 'power3.out', delay: 0.8 }
        );

        gsap.fromTo(
            '.login-btn',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1.1 }
        );

        gsap.fromTo(
            '.login-header',
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 1, ease: 'power3.out', delay: 1.2 }
        );
    }, [navigate]);

    const handleBackClick = () => {
        navigate('/'); // Navigate back to Homepage
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const response = await axios.post('/api/user/login', { email, password });

            // Store token and user details in localStorage
            const { token, _id, name, pic } = response.data;
            localStorage.setItem(
                'userInfo',
                JSON.stringify({ id: _id, name, email, pic, token })
            );

            console.log('Login successful:', response.data);
            navigate('/chat'); // Redirect to chat after login
        } catch (err) {
            console.error('Login failed:', err);
            setError('Invalid email or password'); // Set error message if login fails
        }
    };

    return (
        <div className="container mx-auto h-screen flex items-center justify-center login-container">
            <div className="bg-gray-700 w-full max-w-lg p-8 rounded-lg shadow-lg login-form">
                <h2
                    htmlFor="head"
                    className="text-white text-2xl flex justify-center login-header"
                >
                    Login
                </h2>
                {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-white mb-2 email-label"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 text-gray-800 rounded email-input"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-white mb-2 password-label"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 text-gray-800 rounded password-input"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 w-full login-btn"
                    >
                        Login
                    </button>
                </form>

                {/* Back Button */}
                <button
                    onClick={handleBackClick}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300 mt-4 back-btn"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default Login;
