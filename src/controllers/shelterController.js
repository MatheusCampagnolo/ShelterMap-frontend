let availableNeeds = [
  "Food",
  "Water",
  "Clothing",
  "Medicine",
  "Volunteers",
  "Transportation",
  "Toiletries",
  "Money",
  "Blankets",
  "Baby stuff",
  "Pet food",
  "Cleaning supplies",
  "Educational supplies",
  "Toys",
  "Books",
  "Tools",
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
  "Emergency",
  "Disaster",
  "Earthquake",
  "Hurricane",
  "Flood",
  "Wildfire",
  "Tornado",
  "Covid-19",
  "Homeless",
];

let shelters = [
  {
    id: 1,
    name: "Example Shelter 1",
    location: "Porto Alegre, Brazil",
    latitude: -30.0346,
    longitude: -51.2177,
    description: [
      availableTags[0], // Family-friendly
      availableTags[13], // Flood
    ],
    needs: [
      availableNeeds[0], // Food
      availableNeeds[9], // Baby stuff
    ],
    user: "user1@gmail.com",
    upvotes: 5,
  },
  {
    id: 2,
    name: "Example Shelter 2",
    location: "Rio de Janeiro, Brazil",
    latitude: -22.9068,
    longitude: -43.1729,
    description: [
      availableTags[5], // Brazil
      availableTags[2], // Medical
    ],
    needs: [
      availableNeeds[2], // Clothing
      availableNeeds[11], // Cleaning supplies
    ],
    user: "user2@gmail.com",
    upvotes: 12,
  },
  {
    id: 3,
    name: "Example Shelter 3",
    location: "São Paulo, Brazil",
    latitude: -23.5505,
    longitude: -46.6333,
    description: [
      availableTags[0], // Family-friendly
      availableTags[4], // Elderly
    ],
    needs: [
      availableNeeds[1], // Water
      availableNeeds[3], // Medicine
    ],
    user: "user3@gmail.com",
    upvotes: 8,
  },
  {
    id: 4,
    name: "Example Shelter 4",
    location: "Florianópolis, Brazil",
    latitude: -27.5954,
    longitude: -48.548,
    description: [
      availableTags[1], // Pet-friendly
      availableTags[9], // Emergency
    ],
    needs: [
      availableNeeds[10], // Pet food
      availableNeeds[5], // Transportation
    ],
    user: "user4@gmail.com",
    upvotes: 20,
  },
  {
    id: 5,
    name: "Example Shelter 5",
    location: "Curitiba, Brazil",
    latitude: -25.4284,
    longitude: -49.2733,
    description: [
      availableTags[12], // Flood
      availableTags[15], // Covid-19
    ],
    needs: [
      availableNeeds[0], // Food
      availableNeeds[6], // Toiletries
    ],
    user: "user5@gmail.com",
    upvotes: 10,
  },
  {
    id: 6,
    name: "Example Shelter 6",
    location: "Salvador, Brazil",
    latitude: -12.9714,
    longitude: -38.5014,
    description: [
      availableTags[3], // Children
      availableTags[9], // Emergency
    ],
    needs: [
      availableNeeds[4], // Volunteers
      availableNeeds[12], // Educational supplies
    ],
    user: "user6@gmail.com",
    upvotes: 7,
  },
  {
    id: 7,
    name: "Example Shelter 7",
    location: "Fortaleza, Brazil",
    latitude: -3.7172,
    longitude: -38.5434,
    description: [
      availableTags[1], // Pet-friendly
      availableTags[13], // Hurricane
    ],
    needs: [
      availableNeeds[8], // Blankets
      availableNeeds[11], // Cleaning supplies
    ],
    user: "user7@gmail.com",
    upvotes: 15,
  },
  {
    id: 8,
    name: "Example Shelter 8",
    location: "Recife, Brazil",
    latitude: -8.0476,
    longitude: -34.877,
    description: [
      availableTags[2], // Medical
      availableTags[10], // Earthquake
    ],
    needs: [
      availableNeeds[3], // Medicine
      availableNeeds[14], // Toys
    ],
    user: "user8@gmail.com",
    upvotes: 18,
  },
  {
    id: 9,
    name: "Example Shelter 9",
    location: "Belo Horizonte, Brazil",
    latitude: -19.9167,
    longitude: -43.9345,
    description: [
      availableTags[0], // Family-friendly
      availableTags[16], // Homeless
    ],
    needs: [
      availableNeeds[7], // Money
      availableNeeds[15], // Books
    ],
    user: "user9@gmail.com",
    upvotes: 9,
  },
  {
    id: 10,
    name: "Example Shelter 10",
    location: "Manaus, Brazil",
    latitude: -3.119,
    longitude: -60.0217,
    description: [
      availableTags[4], // Elderly
      availableTags[9], // Emergency
    ],
    needs: [
      availableNeeds[2], // Clothing
      availableNeeds[5], // Transportation
    ],
    user: "user10@gmail.com",
    upvotes: 22,
  },
];

exports.availableNeeds = availableNeeds;
exports.availableTags = availableTags;
exports.shelters = shelters;

exports.getAllShelters = (req, res) => {
  const { description, needs, upvotes } = req.query;

  let filteredShelters = shelters;

  // Filter shelters based on query parameters

  // Filter by description
  if (description && description.length > 0) {
    filteredShelters = filteredShelters.filter((shelter) =>
      description.every((tag) => shelter.description.includes(tag))
    );
  }

  // Filter by needs
  if (needs && needs.length > 0) {
    filteredShelters = filteredShelters.filter((shelter) =>
      needs.every((need) => shelter.needs.includes(need))
    );
  }

  // Sort by upvotes
  if (upvotes === "asc") {
    filteredShelters.sort((a, b) => a.upvotes - b.upvotes);
  } else if (upvotes === "desc") {
    filteredShelters.sort((a, b) => b.upvotes - a.upvotes);
  }

  res.render("shelters", {
    title: "All Shelters - ShelterMap",
    shelters: filteredShelters,
    availableNeeds,
    availableTags,
  });
};

exports.getNewShelterPage = (req, res) => {
  res.render("new-shelter", {
    title: "New Shelter - ShelterMap",
  });
};

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

exports.getShelterDetails = (req, res) => {
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

  res.render("edit-shelter", {
    title: "Edit Shelter",
    shelter,
    availableTags,
    availableNeeds,
  });
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
  const shelterId = parseInt(req.params.id);

  const shelterIndex = shelters.findIndex(
    (shelter) => 
      shelter.id === shelterId && shelter.user === req.user.email
  )

  if (shelterIndex === -1) {
    return res.status(404).send("Shelter not found");
  }

  shelters.splice(shelterIndex, 1);

  res.redirect("/profile");
};

exports.upvoteShelter = (req, res) => {
  const shelterId = parseInt(req.params.id);
  const shelter = shelters.find((shelter) => shelter.id === shelterId);

  if (!shelter) {
    return res.status(404).send("Shelter not found");
  }

  shelter.upvotes += 1;

  res.redirect(`/shelters`);
};
