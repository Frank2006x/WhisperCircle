const express = require("express");
const route = express.Router();
const controller = require("../controllers/signUpController");
route.get("/", controller.get);
route.post("/",controller.post)


module.exports=route;