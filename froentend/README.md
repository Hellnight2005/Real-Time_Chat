<<<<<<< HEAD

# Current Work: Chat Application

## Overview

I am developing a chat application that allows users to communicate in real-time. The application will feature user authentication, chat rooms, direct messaging, and notifications.

## Features

- **User Authentication**: Users can sign up, log in, and log out.
- **Real-time Messaging**: Messages are sent and received in real-time using WebSocket or similar technology.
- **Chat Rooms**: Users can join different chat rooms based on their interests or topics.
- **Direct Messaging**: Users can send private messages to each other.
- **Notifications**: Users receive notifications for new messages.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.io

## Current Progress

- User authentication has been implemented.
- Basic chat room functionality has been developed.
- Real-time messaging is being tested.
- UI components are being styled using CSS and a library like Bootstrap.

## Next Steps

- Complete the implementation of direct messaging.
- Add user presence indicators (online/offline status).
- Enhance the UI/UX for a better user experience.
- # Test and deploy the application.

# Current Work: Chat Application

## Overview

I am developing a chat application that allows users to communicate in real-time. The application will feature user authentication, chat rooms, direct messaging, and notifications.

## Features

- **User Authentication**: Users can sign up, log in, and log out.
- **Real-time Messaging**: Messages are sent and received in real-time using WebSocket or similar technology.
- **Chat Rooms**: Users can join different chat rooms based on their interests or topics.
- **Direct Messaging**: Users can send private messages to each other.
- **Notifications**: Users receive notifications for new messages.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.io

## Current Progress

- User authentication has been implemented.
- Basic chat room functionality has been developed.
- Real-time messaging is being tested.
- UI components are being styled using CSS and a library like Bootstrap.

## Next Steps

- Complete the implementation of direct messaging.
- Add user presence indicators (online/offline status).
- Enhance the UI/UX for a better user experience.
- Test and deploy the application.

# Chat and User Authentication API

This API is built with Express.js and MongoDB to handle user registration, login, and chat functionality, including creating one-on-one chats and retrieving users.

## What It Does

- **User Authentication**: Users can register and log in with JWT-based authentication.
- **Chat Management**: Allows users to initiate or retrieve one-on-one chats with other users.
- **Protected Routes**: Secures certain routes so only authorized users can access them.

## Routes and Their Functions

### User Routes

| Method | Endpoint          | Description                                                   |
| ------ | ----------------- | ------------------------------------------------------------- |
| `POST` | `/api/user`       | Registers a new user                                          |
| `POST` | `/api/user/login` | Authenticates user login and provides a JWT                   |
| `GET`  | `/api/user`       | Retrieves all users, excluding the logged-in user (protected) |

### Chat Routes

| Method | Endpoint    | Description                                                       |
| ------ | ----------- | ----------------------------------------------------------------- |
| `POST` | `/api/chat` | Checks for or creates a one-on-one chat between users (protected) |

## Getting Started

To set up the project, clone the repository, install dependencies, configure environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`), and start the server using `npm start`.

---

# Day 3

**Objectives:**

- Enhance the user profile display component.
- Implement functionality to retrieve and display user data.

---

**Tasks Completed:**

1. **User Profile Component Development:**

   - Created a `ProfileContainer` component to manage and display user profile information.
   - Implemented the following features:
     - Display user profile picture with a circular shape.
     - Show user ID, name, and email retrieved from local storage.
     - Fallback to a default profile image if no image is provided.

2. **Data Handling:**

   - Used `useEffect` to retrieve user data from local storage.
   - Parsed the retrieved user data to update the component state.
   - Added functionality to generate a random user ID for demonstration purposes.

3. **Click Outside to Navigate:**

   - Implemented functionality to navigate to the chat page when clicking outside the profile container using a `useRef` to track the container.

4. **Styling Enhancements:**

   - Applied Tailwind CSS for layout and styling:
     - Added a background color for the profile container.
     - Added hover effects to scale the profile image without rotation.
     - Styled the text elements for user information with transition effects on hover.

5. **Image Import:**

   - Imported a profile image from the `src/assets` folder.
   - Ensured the image displays correctly in the profile section.

6. **Testing:**
   - Verified the functionality of the profile container by testing user data retrieval and navigation.

---

**Next Steps:**

- Implement additional features for user interaction (e.g., editing profile).
- Enhance user experience with more animations and transitions.
- Integrate backend services for fetching user data dynamically.

This overview provides the core functionality and routes, making it easy to understand the purpose of each endpoint.

> > > > > > > c9afc27f47b5baa05edb30a73b43f02ae77ff9cd
