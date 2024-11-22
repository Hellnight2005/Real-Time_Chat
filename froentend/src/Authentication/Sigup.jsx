import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import profile from '../assets/profile.jpeg';
import { gsap } from 'gsap';

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        pic: null,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(profile); // Default image preview

    // Animate component on mount
    React.useEffect(() => {
        gsap.from('.signup-container', { opacity: 0, y: 30, duration: 1 });
        gsap.from('.profile-image', { scale: 0, duration: 1, delay: 0.3 });
        gsap.from('.form-field', { x: -50, opacity: 0, stagger: 0.2, duration: 1 });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (file && !validTypes.includes(file.type)) {
            setError('Please upload a valid image (JPEG, PNG, GIF).');
            return;
        }

        setFormData({ ...formData, pic: file });
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let picUrl = '';
        if (formData.pic) {
            const formDataToUpload = new FormData();
            formDataToUpload.append('file', formData.pic);
            formDataToUpload.append('upload_preset', 's3top77o');

            try {
                const cloudinaryResponse = await axios.post(
                    `https://api.cloudinary.com/v1_1/hellnight2005/image/upload`,
                    formDataToUpload
                );
                picUrl = cloudinaryResponse.data.secure_url;
            } catch (error) {
                console.error('Error uploading image to Cloudinary:', error);
                setError('Image upload failed. Please try again.');
                setLoading(false);
                return;
            }
        }

        try {
            const response = await axios.post(
                '/api/user',
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    pic: picUrl,
                },
                { headers: { 'Content-type': 'application/json' } }
            );

            const { token, _id, name, email, pic } = response.data;
            localStorage.setItem(
                'userInfo',
                JSON.stringify({ id: _id, name, email, pic, token })
            );

            navigate('/chat');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <div className="signup-container container mx-auto h-screen flex items-center justify-center">
            <div className="bg-gray-700 w-full max-w-lg p-8 rounded-lg shadow-lg">
                <h2 className="text-white text-2xl  flex justify-center mb-4">Sign Up</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center gap-4 mb-4">
                        <img
                            className="profile-image w-12 h-12 rounded-full"
                            src={preview}
                            alt="Profile preview"
                        />
                        <div className="font-medium text-white">
                            <div>{formData.name || 'Username'}</div>
                            <div className="text-sm text-gray-500">
                                Joined in {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                    <div className="form-field mb-4">
                        <label className="block text-white mb-2">Username</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:ring focus:ring-blue-500"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="form-field mb-4">
                        <label className="block text-white mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:ring focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-field mb-4">
                        <label className="block text-white mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:ring focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="form-field mb-4">
                        <label className="block text-white mb-2">Profile Picture</label>
                        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                            <input
                                type="file"
                                name="pic"
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            Choose File
                        </label>
                        {formData.pic && (
                            <p className="text-sm text-gray-400 mt-2">
                                {formData.pic.name}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className={`submit-btn bg-blue-600 text-white px-6 py-2 mt-4 rounded-lg hover:bg-blue-700 transition duration-300 w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={loading}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                <button
                    onClick={handleBackClick}
                    className="back-btn bg-gray-600 text-white px-6 py-2 mt-4 rounded-lg hover:bg-gray-700 transition duration-300 w-full"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default Signup;
