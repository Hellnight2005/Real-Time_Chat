export const getSender = (loggedUser, users) => {
  console.log(loggedUser); // Verify loggedUser structure
  console.log(users); // Log the users array to verify the structure

  if (!users || users.length !== 2) {
    console.error("Users array is invalid or does not contain exactly 2 users");
    return "Unknown"; // Fallback value
  }

  if (users[0]._id === loggedUser.id) {
    return users[1]; // Return receiver's name if the loggedUser is the sender
  } else if (users[1]._id === loggedUser.id) {
    return users[0]; // Return sender's name if the loggedUser is the receiver
  } else {
    console.error("Logged user ID doesn't match any user in the list");
    return "Unknown"; // Fallback in case there's no match
  }
};

export const getSenderfull = (loggedUser, users) => {
  console.log(loggedUser); // Verify loggedUser structure
  console.log(users); // Log the users array to verify the structure

  if (!users || users.length !== 2) {
    console.error("Users array is invalid or does not contain exactly 2 users");
    return null; // Fallback value for an invalid or missing user
  }

  // Return the user who is not the loggedUser
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
