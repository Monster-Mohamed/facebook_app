const express = require("express");

// routes required
const user = require("./routes/UserRouter");

// creating the api router
const api = express.Router();

// using these routes
api.use("/user", user);

module.exports = api;
