const express = require("express");
const app = express();
const foodController = require("../controllers/food.controller");
const auth = require("../auth/auth");

app.post("/", auth.authVerify, foodController.addFood);
app.get("/all", foodController.getAll);
app.get("/:search", foodController.searchFood);
app.put("/:id", auth.authVerify, foodController.updateFood);
app.delete("/:id", auth.authVerify, foodController.deleteFood);

module.exports = app;
