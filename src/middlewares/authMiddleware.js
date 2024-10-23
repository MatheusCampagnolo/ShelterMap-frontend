const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.redirect("/login");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.redirect("/login");
    req.user = user;
    next();
  });
};
