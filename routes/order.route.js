const express = require("express");
const app = express();
const orderController = require("../controllers/order.controller");
const auth = require("../auth/auth");

app.post("/", orderController.customerOrder);
app.get("/", auth.authVerify, orderController.getOrderHistory);

module.exports = app;
