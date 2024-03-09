// controllers/userController.js

const connection = require("../config/mysql");

// Create a new user
const createUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const newUser = [username, email]; // Pass parameters as an array

    await connection.execute("INSERT INTO users (username, email) VALUES (?, ?)", newUser);
    console.log("Added user");
    res.status(201).json({ message: "User added successfully" });
  } catch (err) {
    console.error("Error adding user", err);
    res.status(500).json({ error: "Error adding user" });
  }
};;

// Get all users
const getUser = async (req, res) => {
  try {
    const [results] = await connection.execute("SELECT * FROM users");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching users", err);
    res.status(500).json({ error: "Error fetching users" });
  }
};

// Update user by ID
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = req.body;

    // Extract the properties from the updatedUser object
    const { username, email } = updatedUser;

    // Ensure that at least one property is provided for update
    if (!username && !email) {
      return res.status(400).json({ error: "Provide at least one property for update (username or email)." });
    }

    // Build the SQL query dynamically based on the provided properties
    let updateQuery = "UPDATE users SET";
    const updateParams = [];

    if (username) {
      updateQuery += " username = ?,";
      updateParams.push(username);
    }

    if (email) {
      updateQuery += " email = ?,";
      updateParams.push(email);
    }

    // Remove the trailing comma and add the WHERE clause
    updateQuery = updateQuery.slice(0, -1) + " WHERE id = ?";
    updateParams.push(id);

    // Execute the query
    await connection.execute(updateQuery, updateParams);

    console.log("Updated user");
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user", err);
    res.status(500).json({ error: "Error updating user" });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await connection.execute("DELETE FROM users WHERE id = ?", [id]);
    console.log("Deleted user");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user", err);
    res.status(500).json({ error: "Error deleting user" });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
