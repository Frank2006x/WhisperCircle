const bcrypt = require("bcrypt");
const pool = require("../db/pool");
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters";
const emailErr = "Email must be in abc@xyz.com format";
const ageErr = "age must be between 18 to 120";

const validateUser = [
  body("fName")
    .trim()
    .isAlpha()
    .withMessage(`First name${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body("lName")
    .optional({ checkFalsy: true })
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
  body("username").custom(async (value) => {
    const id  = await db.getId(value);
    
    if (id) {
      throw new Error("Username already exists");
    } else {
      return true;
    }
  }),
];

module.exports = {
  get: (req, res) => {
    res.render("sign-up", { data: {} });
  },
  post: [
    validateUser,
    async (req, res, next) => {
      try {
        const errors = validationResult(req);
        let err = errors.array();
        if (req.body.password != req.body.confirmPassword) {
          err.push({
            msg: "Passwords do not match",
            param: "confirmpassword",
            location: "body",
          });
        }
        if (err.length > 0) {
          return res.status(400).render("sign-up", {
            errors: err,
            data: req.body,
          });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await pool.query(
          "Insert into login (fname,lname,username,password) values ($1,$2,$3,$4)",
          [req.body.fName, req.body.lName, req.body.username, hashedPassword]
        );
        res.redirect("/login");
      } catch (err) {
        return next(err);
      }
    },
  ],
};
