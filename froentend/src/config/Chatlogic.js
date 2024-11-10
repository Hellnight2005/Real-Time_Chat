export const getSender = (loggedUser, users) => {
  console.log(users); // Log the users array to verify the structure

  if (!users || users.length < 2) {
    console.error("Users array is invalid or does not contain enough users");
    return "Unknown"; // Fallback value
  }

  return users[0]._id === loggedUser._id ? users[0].name : users[1].name;
};

export const getSenderfull = (loggedUser, users) => {
  console.log(users); // Log the users array to verify the structure

  if (!users || users.length < 2) {
    console.error("Users array is invalid or does not contain enough users");
    return null; // Fallback value for an invalid or missing user
  }

  return users[0]._id === loggedUser._id ? users[0] : users[1];
};
