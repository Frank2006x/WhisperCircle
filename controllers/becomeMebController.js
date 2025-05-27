const db = require("../db/queries");
const pool = require("../db/pool");
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.render("login", { errors: "Please log in to become a member" });
  }
  next();
}
async function toCheckMemberAlready(req, res, next) {
  const { rows } = await pool.query("select username from member");
  const usernames=rows.map((row) => {
    return row.username;
  });
  if (usernames.includes(req.user.username)) {
    const id = await db.getId(req.user.username);
    return res.redirect(`/home/${id}`);
  }
  next();
}

module.exports = {
  get: [
    isLoggedIn,
    toCheckMemberAlready,
    (req, res) => {
      res.render("member");
    },
  ],
  post: async (req, res, next) => {
    const password = req.body.secretCode;
    if (password == process.env.MPASSWORD) {
      try {
        const id = await db.getId(req.user.username);
        console.log(id);
        await db.saveAdmin(req.user.username);
        return res.redirect(`/home/${id}`);
      } catch (err) {
        return next(err);
      }
    } else {
      return res.render("member", { errors: "wrong code" });
    }
  },
};
