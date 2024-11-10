import React from 'react';

function UserBadgeItem({ user, handleFunction, isNewUser }) {
    return (
        <div
            className={`flex items-center justify-between bg-purple-700 text-white p-2 my-1 rounded-full ${isNewUser ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
        >
            <span>{user.name}</span>
            <button onClick={handleFunction} className="">
                ✕
            </button>
        </div>
    );
}

export default UserBadgeItem;
