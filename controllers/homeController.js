const db = require("../db/queries");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = {
  get: [
    isLoggedIn,
    async (req, res) => {
      const msgs = await db.loadMsg();
      console.log(msgs);
      const id=await db.getId(req.user.username)
      res.render("home", {userId: id, msg: msgs });
    },
  ],
  post: async (req, res) => {
    const message = req.body.message;
    const id = await db.getId(req.user.username);
    await db.addMsg(message, id);
    res.redirect(`/home/${id}`);
  },
};
