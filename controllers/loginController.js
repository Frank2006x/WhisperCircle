const passport = require("passport");


module.exports = {
  get: (req, res) => {
    res.render("login");
  },
  post: passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/sign-up",
  }),
};
