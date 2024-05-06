const express = require("express");
const app = express();
const adminController = require("../controllers/admin.controller");
const auth = require("../auth/auth");

app.post("/auth", adminController.authentication);
app.post("/register", adminController.register);
app.get("/", auth.authVerify, adminController.getAllAdmin);
app.delete("/", auth.authVerify, adminController.deleteOwnAccount);

module.exports = app;
