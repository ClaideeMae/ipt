const connection = require("../config/mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = [username, email, hashedpassword]; 



    await connection.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", newUser);
    console.log("Added user");
    res.status(201).json({ message: "User added successfully" });
  } catch (err) {
    console.error("Error adding user", err);
    res.status(500).json({ error: "Error adding user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (!user || user.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user[0].password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // User is authenticated, generate a JWT
    const token = jwt.sign({ userId: user[0].id, email: user[0].email }, "123", { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error during login", err);
    res.status(500).json({ error: "Error during login" });
  }
};

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

    const { username, email } = updatedUser;

    if (!username && !email) {
      return res.status(400).json({ error: "Provide at least one property for update (username or email)." });
    }

   
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
   
    updateQuery = updateQuery.slice(0, -1) + " WHERE id = ?";
    updateParams.push(id);

    await connection.execute(updateQuery, updateParams);

    console.log("Updated user");
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user", err);
    res.status(500).json({ error: "Error updating user" });
  }
};

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
  login
};
