import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import profile from '../assets/profile.jpeg'
function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        pic: null,
    });
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(profile); // Default image

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, pic: file });

        // Set preview URL if a file is selected
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('pic', formData.pic);

        try {
            const response = await axios.post('/api/signup', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            navigate('/');
        } catch (err) {
            setError('Signup failed. Please try again.');
            console.error(err);
        }
    };

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <div className="container mx-auto h-screen flex items-center justify-center">
            <div className="bg-gray-700 w-full max-w-lg p-8 rounded-lg shadow-lg">
                <h2 className="text-white text-2xl mb-4">Sign Up</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center gap-4 mb-4">
                        <img
                            className="w-10 h-10 rounded-full"
                            src={preview}
                            alt="Profile preview"
                        />
                        <div className="font-medium text-white">
                            <div>{formData.username || 'Username'}</div>
                            <div className="text-sm text-gray-500">Joined in {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2">Profile Picture</label>
                        <input
                            type="file"
                            name="pic"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 rounded"
                            accept="image/*"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 w-full"
                    >
                        Sign Up
                    </button>
                </form>
                <button
                    onClick={handleBackClick}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300 mt-4 w-full"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default Signup;
