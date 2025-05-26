const express = require("express");
const homeController = require("../controllers/homeController");
const route = express.Router();

route.get("/", homeController.get);

module.exports = route;
