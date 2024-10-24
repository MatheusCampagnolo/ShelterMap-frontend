let AllShelters = require("../controllers/shelterController").shelters;
let userShelters = [];

exports.showProfile = (req, res) => {
  let user = req.user.email;

  if (!AllShelters) {
    return res.status(404).send("Shelters not found");
  }

  userShelters = AllShelters.filter((s) => s.user === user);

  if (userShelters.length === 0) {
    return res.render("profile", {
      title: "Profile - ShelterMap",
      shelters: [],
    });
  }else{
    return res.render("profile", {
      title: "Profile - ShelterMap",
      shelters: userShelters,
    });
  }
};