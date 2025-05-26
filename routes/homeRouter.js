const express = require("express");
const homeController = require("../controllers/homeController");
const route = express.Router();

route.get("/:id", homeController.get);

module.exports = route;
