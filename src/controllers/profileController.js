const { shelters } = require("./shelterController");

exports.showProfile = (req, res) => {
  const userShelters = shelters.filter(
    (shelter) => shelter.user === req.user.email
  );

  res.render("profile", {
    title: "Profile - ShelterMap",
    shelters: userShelters,
  });
};
