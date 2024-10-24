const bcrypt = require("bcryptjs");
const e = require("express");
const jwt = require("jsonwebtoken");

let users = [
  {
    username: "user1",
    email: "user1@gmail.com",
    password: "$2a$10$Z1V6iK3b7t0zqUuKm6Zb7eP1oZ4X2B2G3y8o7wvFJ7O0t3Jv9sY7S", // password: password1
  },
  {
    username: "user2",
    email: "user2gmail.com",
    password: "$2a$10$Z1V6iK3b7t0zqUuKm6Zb7eP1oZ4X2B2G3y8o7wvFJ7O0t3Jv9sY7S", // password: password1,
  },
  {
    username: "user3",
    email: "user3@gmail.com",
    password: "$2a$10$Z1V6iK3b7t0zqUuKm6Zb7eP1oZ4X2B2G3y8o7wvFJ7O0t3Jv9sY7S", // password: password1
  },
  {
    username: "user4",
    email: "user4@gmail.com",
    password: "$2a$10$Z1V6iK3b7t0zqUuKm6Zb7eP1oZ4X2B2G3y8o7wvFJ7O0t3Jv9sY7S", // password: password1
  },
  {
    username: "user5",
    email: "user5@gmail.com",
    password: "$2a$10$Z1V6iK3b7t0zqUuKm6Zb7eP1oZ4X2B2G3y8o7wvFJ7O0t3Jv9sY7S", // password: password1
  },
  {
    username: "user6",
    email: "user6@gmail.com",
    password: "$2a$10$Z1V6iK3b7t0zqUuKm6Zb7eP1oZ4X2B2G3y8o7wvFJ7O0t3Jv9sY7S", // password: password1
  },
  {
    username: "user7",
    email: "user7@gmail.com",
    password: "$2a$10$Z1V6iK3b7t0zqUuKm6Zb7eP1oZ4X2B2G3y8o7wvFJ7O0t3Jv9sY7S", // password: password1
  },
  {
    username: "user8",
    email: "user8@gmail.com",
    password: "$2a$10$Z1V6iK3b7t0zqUuKm6Zb7eP1oZ4X2B2G3y8o7wvFJ7O0t3Jv9sY7S", // password: password1
  },
  {
    username: "user9",
    email: "user9@gmail.com",
    password: "$2a$10$Z1V6iK3b7t0zqUuKm6Zb7eP1oZ4X2B2G3y8o7wvFJ7O0t3Jv9sY7S", // password: password1
  },
  {
    username: "user10",
    email: "user10@gmail.com",
    password: "$2a$10$Z1V6iK3b7t0zqUuKm6Zb7eP1oZ4X2B2G3y8o7wvFJ7O0t3Jv9sY7S", // password: password1
  },
]; // Temporarily store users in memory

exports.getRegisterPage = (req, res) => {
  res.render("register", { title: "Register - ShelterMap" });
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  // Verify if user already exists
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).send("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = { username, email, password: hashedPassword };
  users.push(newUser);

  // Create JWT token
  const token = jwt.sign({ username, email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Set token in cookies
  res.cookie("jwt", token, { httpOnly: true });
  res.redirect("/profile"); // Redirect to profile page
};

exports.getLoginPage = (req, res) => {
  res.render("login", { title: "Login - ShelterMap" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Verify if user exists
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid email or password");
  }

  // Create JWT token
  const token = jwt.sign(
    { username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Set token in cookies
  res.cookie("jwt", token, { httpOnly: true });
  res.redirect("/profile");
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
};
