const passport = require("passport");
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/home");
  }
  next();
}

module.exports = {
  get: [
    isLoggedIn,
    (req, res) => {
      res.render("login");
    },
  ],
  post: passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
  }),
};
