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
    (req, res, next) => {
      passport.authenticate("local", async (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          return res.render("login", { errors: info.message });
        }

        req.logIn(user, async (err) => {
          if (err) return next(err);
          try {
            const id = await db.getId(user.username);
            res.redirect(`/home/${id}`);
          } catch (dbErr) {
            next(dbErr);
          }
        });
      })(req, res, next);
    },
  ],
};
