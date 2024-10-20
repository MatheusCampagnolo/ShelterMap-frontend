require("dotenv").config();

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

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
app.use(methodOverride("_method"));

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

  res.render("index", {
    title: "ShelterMap - Home",
    filteredShelters: shelters
  });
});

// ------------------- PROFILE GET ROUTES -------------------

app.get("/profile", authenticateToken, (req, res) => {
  const userShelters = shelters.filter(
    (shelter) => shelter.user === req.user.email
  );

  res.render("profile", {
    title: "Profile - ShelterMap",
    shelters: userShelters,
  });
});

// Route to show all shelters created by the user
app.get("/profile/shelters", authenticateToken, (req, res) => {
  // Filter shelters created by the user
  const userShelters = shelters.filter(
    (shelter) => shelter.user === req.user.email
  );

  res.render("manage-shelters", {
    title: "Manage Your Shelters",
    shelters: userShelters,
  });
});

// ------------------- AUTH GET ROUTES -------------------

app.get("/register", (req, res) => {
  res.render("register", { title: "Register - ShelterMap" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login - ShelterMap" });
});

// ------------------- Shelters GET ROUTES -------------------

// Route to show all shelters
app.get("/shelters", (req, res) => {
  const { description, needs, upvotes } = req.query;

  let filteredShelters = shelters;

  // Get all tags from shelters
  if (description && description.length > 0) {
    filteredShelters = filteredShelters.filter((shelter) =>
      description.every((tag) => shelter.description.includes(tag))
    );
  }

  // Get all needs from shelters
  if (needs && needs.length > 0) {
    filteredShelters = filteredShelters.filter((shelter) =>
      needs.every((need) => shelter.needs.includes(need))
    );
  }

  // Sort shelters by upvotes
  if (upvotes) {
    filteredShelters = filteredShelters.sort((a, b) => {
      return upvotes === "asc" ? a.upvotes - b.upvotes : b.upvotes - a.upvotes;
    });
  }

  // Get all available tags and needs
  const availableTags =
    shelters.length > 0
      ? Array.from(new Set(shelters.flatMap((shelter) => shelter.description)))
      : [];

  const availableNeeds =
    shelters.length > 0
      ? Array.from(new Set(shelters.flatMap((shelter) => shelter.needs)))
      : [];

  res.render("shelters", {
    title: "All Shelters",
    filteredShelters,
    availableTags,
    availableNeeds,
  });
});

// Simulação dos dados de tags e needs (para posteriormente puxar da API)
const allTags = ["animal shelter", "pet friendly", "Brazil", "temporary", "long-term"];
const allNeeds = ["hygiene products", "medicine", "food", "clothing"];

// Rota para fornecer as tags e needs ao frontend
app.get('/shelters/options', (req, res) => {
  res.json({
    tags: allTags,
    needs: allNeeds
  });
});

// Route to add a new shelter
app.get("/shelters/new", authenticateToken, (req, res) => {
  res.render("new-shelter", { title: "Add a New Shelter" });
});

// Route to show shelter details
app.get("/shelters/:id", (req, res) => {
  const shelterId = parseInt(req.params.id);
  const shelter = shelters.find((shelter) => shelter.id === shelterId);

  if (!shelter) {
    return res.status(404).send("Shelter not found");
  }

  res.render("shelter-details", {
    title: `Shelter - ${shelter.name}`,
    shelter,
  });
});

// Route to show shelter edit form
app.get("/shelters/:id/edit", authenticateToken, (req, res) => {
  const shelter = shelters.find(
    (s) => s.id === parseInt(req.params.id) && s.user === req.user.email
  );

  if (!shelter) return res.status(404).send("Shelter not found");

  res.render("edit-shelter", { title: "Edit Shelter", shelter });
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
app.post("/shelters/new", authenticateToken, (req, res) => {
  const { name, location, latitude, longitude } = req.body;

  // Criar o novo abrigo
  const newShelter = {
    id: shelters.length + 1, // Simulate a database ID, after connecting to a database, this will be done automatically
    name,
    location,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    description: [],
    needs: [],
    user: req.user.email, // Relate the shelter to the user who created it
  };

  shelters.push(newShelter); // Add the new shelter to the array

  res.redirect("/shelters"); // Redirect to the shelters page
});

// Route to handle shelter updates
app.post("/shelters/:id/edit", authenticateToken, (req, res) => {
  const shelterIndex = shelters.findIndex(
    (shelter) =>
      shelter.id === parseInt(req.params.id) && shelter.user === req.user.email
  );

  if (shelterIndex === -1) {
    return res.status(404).send("Shelter not found");
  }

  const { name, location, description, needs } = req.body;

  // Update shelter
  shelters[shelterIndex].name = name;
  shelters[shelterIndex].location = location;
  shelters[shelterIndex].description = Array.isArray(description)
    ? description
    : [description];
  shelters[shelterIndex].needs = Array.isArray(needs) ? needs : [needs];

  res.redirect("/profile/shelters");
});

// Route to handle shelter upvotes
app.post("/shelters/:id/upvote", authenticateToken, (req, res) => {
  const shelterId = parseInt(req.params.id);

  // Find shelter by ID
  const shelter = shelters.find((shelter) => shelter.id === shelterId);
  if (!shelter) {
    return res.status(404).send("Shelter not found");
  }

  // Ensure that upvotes is initialized
  if (typeof shelter.upvotes !== "number") {
    shelter.upvotes = 0; // Initialize as 0 if not defined
  }

  // Ensure that upvotesUsers is initialized
  if (!Array.isArray(shelter.upvotesUsers)) {
    shelter.upvotesUsers = []; // Initialize as an empty array if not defined
  }

  // Check if user has already voted
  const userId = req.user.id; // Get user ID from JWT token
  const userHasVoted = shelter.upvotesUsers.includes(userId);

  if (userHasVoted) {
    // Remove upvote
    shelter.upvotes -= 1;
    shelter.upvotesUsers = shelter.upvotesUsers.filter((id) => id !== userId);
    return res
      .status(200)
      .send({ message: "Upvote removed", upvotes: shelter.upvotes });
  } else {
    // Add upvote
    shelter.upvotes += 1;
    shelter.upvotesUsers.push(userId);
    return res
      .status(200)
      .send({ message: "Upvote successful", upvotes: shelter.upvotes });
  }
});

// ------------------- DELETE ROUTES -------------------

// Route to delete a shelter
app.delete("/shelters/:id", authenticateToken, (req, res) => {
  const shelterIndex = shelters.findIndex(
    (shelter) =>
      shelter.id === parseInt(req.params.id) && shelter.user === req.user.email
  );

  if (shelterIndex === -1) {
    return res.status(404).send("Shelter not found");
  }

  shelters.splice(shelterIndex, 1); // Remove shelter from the array
  res.redirect("/profile/shelters");
});

// ------------------- START SERVER -------------------

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
