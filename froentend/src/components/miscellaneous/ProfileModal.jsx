import React from 'react';

import profile from '../../assets/profile.jpeg'; // Default profile image

function ProfileModal({ chatInfo, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-w-full relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 text-lg font-semibold"
                >
                    X
                </button>

                <h3 className="text-xl font-bold text-blue-600 mb-4">
                    User Info
                </h3>

                {/* If it's a one-on-one chat, display user info */}
                <div>
                    {/* Display the profile picture of the second user */}
                    <img
                        src={chatInfo.users[1]?.pic || profile} // Use the second user's profile pic, or a default one
                        alt="Profile"
                        className="w-16 h-16 rounded-full mx-auto mb-4"
                    />
                    <h4 className="text-lg font-semibold text-center">{chatInfo.users[1]?.name}</h4>
                    <p className="text-center text-sm text-gray-500">{chatInfo.users[1]?.email}</p>
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;
