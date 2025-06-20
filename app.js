if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("./db/pool");

const signUpRouter = require("./routes/signUpRouter");
const loginRouter = require("./routes/loginRouter");
const homeRouter = require("./routes/homeRouter");
const becomeMebRouter = require("./routes/becomeMeb");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "assets")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/sign-up", signUpRouter);
app.use("/login", loginRouter);
app.use("/home", homeRouter);
app.use("/become-member", becomeMebRouter);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "select * from login where username = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match || !user) {
        return done(null, false, { message: "Incorrect password or username" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.loginid);
});

passport.deserializeUser(async (loginid, done) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM login WHERE loginid = $1",
      [loginid]
    );
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// app.listen(3000, () => {
//   console.log("Server Up !!!");
// });

module.exports = app;
