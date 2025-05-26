const passport = require("passport");
const db = require("../db/queries");
async function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    const id = await db.getId(req.user.username);
    return res.redirect(`/home/${id}`);
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
  post: [
    passport.authenticate("local", {
      failureRedirect: "/login",
    }),

    
    async (req, res) => {
      const id = await db.getId(req.user.username); 
      res.redirect(`/home/${id}`);
    },
  ],
};
