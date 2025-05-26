const bcrypt = require("bcrypt");
const pool = require("../db/pool");

module.exports = {
  get: (req, res) => {
    res.render("sign-up");
  },
  post: async (req, res,next) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await pool.query(
        "Insert into login (fname,lname,username,password) values ($1,$2,$3,$4)",
        [req.body.firstName, req.body.lastName, req.body.username, hashedPassword]
      );
      res.redirect("/login");
    } catch (err) {
      return next(err);
    }
  },
};
