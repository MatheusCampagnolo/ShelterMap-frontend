const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let users = [
    // Create some example users
    {
        username: "user1",
        email: "user1@gmail.com",
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
