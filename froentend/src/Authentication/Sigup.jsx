import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        pic: null, // Initialize pic as null
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, pic: e.target.files[0] }); // Update pic with the uploaded file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData(); // Create a FormData object
        formDataToSend.append('username', formData.username);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('pic', formData.pic); // Append the file to FormData

        try {
            const response = await axios.post('/api/signup', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set content type for file upload
                },
            });
            console.log(response.data);
            navigate('/'); // Redirect to homepage on success
        } catch (err) {
            setError('Signup failed. Please try again.');
            console.error(err);
        }
    };

    const handleBackClick = () => {
        navigate('/'); // Navigate back to Homepage
    };

    return (
        <div className="container mx-auto h-screen flex items-center justify-center">
            <div className="bg-gray-700 w-full max-w-lg p-8 rounded-lg shadow-lg">
                <h2 className="text-white text-2xl mb-4">Sign Up</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
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
                            onChange={handleFileChange} // Handle file input change
                            className="w-full px-4 py-2 rounded"
                            accept="image/*" // Accept only image files
                            required
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