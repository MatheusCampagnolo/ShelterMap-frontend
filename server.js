require("dotenv").config();

const express = require("express");
const path = require("path");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Use cookie parser middleware

// ------------------- DATA -------------------

let users = [];

// ------------------- MIDDLEWARE -------------------

// Middleware to check if user is authenticated
function authenticateToken(req, res, next) {
  const token = req.cookies.jwt; // Get token from cookies
  if (!token) return res.redirect("/login");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.redirect("/login");
    req.user = user;
    next();
  });
}

// ------------------- GET ROUTES -------------------

app.get("/", (req, res) => {
  res.render("index", { title: "ShelterMap" });
});

app.get("/profile", authenticateToken, (req, res) => {
  res.render("profile", { title: "Profile - ShelterMap" });
});

app.get("/register", (req, res) => {
  res.render("register", { title: "Register - ShelterMap" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login - ShelterMap" });
});

// ------------------- Shelters GET ROUTES -------------------

app.get("/shelters", (req, res) => {
  res.render("shelters", { title: "Shelters - ShelterMap", shelters });
});

// Route to add a new shelter
app.get('/shelters/new', authenticateToken, (req, res) => {
  res.render('new-shelter', { title: 'Add a New Shelter' });
});

// ------------------- POST ROUTES -------------------

app.post("/register", async (req, res) => {
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
});

app.post("/login", async (req, res) => {
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
});

// ------------------- Shelters POST ROUTES -------------------

// Array to store shelters
let shelters = [];

// Route to add a new shelter
app.post('/shelters/new', authenticateToken, (req, res) => {
  const { name, location, latitude, longitude } = req.body;

  // Criar o novo abrigo
  const newShelter = {
    id: shelters.length + 1, // Simulate a database ID, after connecting to a database, this will be done automatically
    name,
    location,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    user: req.user.email // Relate the shelter to the user who created it
  };

  shelters.push(newShelter); // Add the new shelter to the array

  res.redirect('/shelters'); // Redirect to the shelters page
});


// ------------------- START SERVER -------------------

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
