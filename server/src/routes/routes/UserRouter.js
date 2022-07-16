const express = require("express");
const {
  register,
  activateAccount,
  login,
} = require("../../controllers/UserController");

const user = express.Router();

user.post("/register", register);
user.post("/activate", activateAccount);
user.post("/login", login);

module.exports = user;
