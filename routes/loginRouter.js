const express = require("express");
const route = express.Router();
const controller = require("../controllers/loginController");
route.get("/", controller.get);
route.post("/", controller.post);

module.exports = route;
