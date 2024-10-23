let availableNeeds = [
  "Food", 
  "Water", 
  "Clothing", 
  "Medicine", 
  "Volunteers"
];

let availableTags = [
  "Family-friendly",
  "Pet-friendly",
  "Medical",
  "Children",
  "Elderly",
  "Brazil",
  "Long-term",
  "Short-term",
];

let shelters = [
    {
        id: 1,
        name: "Shelter 1",
        location: "Location 1",
        latitude: 0.0,
        longitude: 0.0,
        description: [
          availableTags[0],
          availableTags[1],
        ],
        needs: [
          availableNeeds[0],
          availableNeeds[1],
        ],
        user: "user1@gmail.com",
        upvotes: 0,
    },
]; // Temporarily store shelters in memory

exports.availableNeeds = availableNeeds;
exports.availableTags = availableTags;
exports.shelters = shelters;

exports.getAllShelters = (req, res) => {
  res.render("shelters", {
    title: "All Shelters - ShelterMap",
    shelters,
    availableNeeds,
    availableTags,
  });
};

exports.getNewShelterPage = (req, res) => {
  res.render("new-shelter", {
    title: "New Shelter - ShelterMap",
  });
}

exports.createShelter = (req, res) => {
  const { name, location, latitude, longitude } = req.body;

  // Create new shelter
  const newShelter = {
    id: shelters.length + 1,
    name,
    location,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    description: [],
    needs: [],
    user: req.user.email, // Relate the shelter to the user who created it
    upvotes: 0,
  };

  shelters.push(newShelter);

  res.redirect("/profile");
};

exports.getShelterDetails  = (req, res) => {
  const shelterId = parseInt(req.params.id);
  const shelter = shelters.find((shelter) => shelter.id === shelterId);

  if (!shelter) {
    return res.status(404).send("Shelter not found");
  }

  res.render("shelter-details", {
    title: `Shelter - ${shelter.name}`,
    shelter,
  });
};

exports.editShelterPage = (req, res) => {
  const shelter = shelters.find(
    (s) => s.id === parseInt(req.params.id) && s.user === req.user.email
  );

  if (!shelter) return res.status(404).send("Shelter not found");

  res.render("edit-shelter", { title: "Edit Shelter", shelter, availableTags, availableNeeds });
};

exports.editShelter = (req, res) => {
  const shelter = shelters.find(
    (s) => s.id === parseInt(req.params.id) && s.user === req.user.email
  );

  if (!shelter) return res.status(404).send("Shelter not found");

  const { name, location, latitude, longitude } = req.body;
  // get description and needs
  const description = req.body.description ? req.body.description : [];
  const needs = req.body.needs ? req.body.needs : [];

  shelter.name = name;
  shelter.location = location;
  shelter.latitude = parseFloat(latitude);
  shelter.longitude = parseFloat(longitude);
  shelter.description = description;
  shelter.needs = needs;

  res.redirect("/profile");
};

exports.deleteShelter = (req, res) => {
  shelters = shelters.filter(s => s.id !== parseInt(req.params.id));

  res.redirect("/profile");
}

exports.upvoteShelter = (req, res) => {
  const shelterId = parseInt(req.params.id);
  const shelter = shelters.find((shelter) => shelter.id === shelterId);

  if (!shelter) {
    return res.status(404).send("Shelter not found");
  }

  if (shelter.upvotes > 0) {
    shelter.upvotes--;
  } else {
    shelter.upvotes++;
  }
  
  res.redirect(`/shelters`);
};