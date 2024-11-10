import React from 'react';

function ChatLoading() {
    return (
        <div className="flex justify-center items-center mt-4">
            {/* Skeleton loader for chat */}
            <div className="flex flex-col space-y-4">
                {/* Skeleton Loader for Profile */}

                {/* Skeleton Loader for Text */}
                <div className="w-64 h-6 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="w-48 h-6 bg-gray-300 rounded-lg animate-pulse"></div>
                {/* Skeleton Loader for Message */}
                <div className="w-full h-16 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
        </div>
    );
}

export default ChatLoading;
