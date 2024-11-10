import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import profile from '../../../src/assets/profile.jpeg'; // Ensure this path is correct

function UserListItem({ handleFunction, user }) {

    // Set a default image if the user pic is not available
    const profilePic = user.pic || profile; // Ensure this path is correct

    return (
        <div
            className="flex items-center p-4 border-b border-gray-300 cursor-pointer transition-all duration-300 ease-in-out transform hover:bg-blue-100 hover:scale-105 hover:shadow-lg"
            onClick={handleFunction}
        >
            {/* Profile Picture */}
            <img
                src={profilePic}
                alt="User Profile"
                className="w-10 h-10 rounded-full mr-4 transition-all duration-300 ease-in-out hover:scale-110"
            />

            {/* User Name and Email */}
            <div className="flex flex-col">
                <span className="font-semibold text-blue-600 transition-colors duration-300 ease-in-out hover:text-blue-800">
                    {user.name}
                </span>
                <span className="text-sm text-gray-500 transition-colors duration-300 ease-in-out hover:text-gray-700">
                    {user.email}
                </span>
            </div>
        </div>
    );
}

// Prop types validation

export default UserListItem;
