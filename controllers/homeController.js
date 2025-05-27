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
      const id = await db.getId(req.user.username);
      const isAdmin = await db.checkAdmin(id);
      
      const msgsWithUsernames = await Promise.all(
        msgs.map(async (msg) => {
          if (isAdmin) {
            const username = await db.getUsernameById(msg.loginid);
            return { ...msg, username: username };
          } else {
            return { ...msg, username: "Anonymous" };
          }
        })
      );
      

      res.render("home", {
        userId: id,
        msg: msgsWithUsernames,
        admin: isAdmin,
      });
    },
  ],
  post: async (req, res) => {
    const message = req.body.message;
    const id = await db.getId(req.user.username);
    await db.addMsg(message, id);
    res.redirect(`/home/${id}`);
  },
  deleteMsg: [
    isLoggedIn,
    async (req, res, next) => {
      const userId = await db.getId(req.user.username);
      const isAdmin = await db.checkAdmin(userId);
      if (!isAdmin) {
        return res.status(403).send("Forbidden");
      }
      const msgId = req.params.msgId;
      await db.deleteMsg(msgId);
      res.redirect(`/home/${userId}`);
    },
  ],
};
