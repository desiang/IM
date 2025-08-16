const User = require("../models/auth-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  //   validation
  let errors = [];
  if (!name) errors.push({ field: name, message: "name is required" });
  if (!email) errors.push({ field: email, message: "email is required" });
  if (!password)
    errors.push({ field: password, message: "password is required" });

  if (errors.length > 0) return res.status(404).json(errors);

  try {
    const emailExists = await User.ifEmailExists(email);
    if (emailExists)
      return res.status(400).json({ message: "Email is already registered." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      await User.createUser(name, email, hashedPassword);
    } catch (error) {
      console.log(error);
    }

    res.status(201).json({
      message: "User has been created successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  let errors = [];
  if (!email) errors.push({ field: "email", message: "Email is required." });
  if (!password) errors.push({ field: "password", message: "Password is required." });
  if (errors.length > 0) return res.status(404).json(errors);

  try {
    const user = await User.getUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET, // set in .env
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}