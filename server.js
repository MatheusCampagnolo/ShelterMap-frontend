require("dotenv").config();
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Express Config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set Visualization Engine
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

// Import Routes
const authRoutes = require("./src/routes/authRoutes");
const shelterRoutes = require("./src/routes/shelterRoutes");
const profileRoutes = require("./src/routes/profileRoutes");

// Use Routes
app.use("/", authRoutes);
app.use("/shelters", shelterRoutes);
app.use("/", profileRoutes);

app.get("/", (req, res) => {
  res.render("index", {
    title: "ShelterMap - Home",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
