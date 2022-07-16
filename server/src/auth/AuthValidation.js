const User = require("../models/User");
const bcrypt = require("bcrypt");

const emailValid = (email) => {
  const emailRef = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/;
  return String(email).toLowerCase().match(emailRef);
};

const emailNotUnique = async (email) => {
  const check = await User.findOne({ email });
  return check;
};

const validateLength = (text = "", min = 1, max = 20) => {
  const t = text.length;
  return t > max || t < min ? false : true;
};

const Crypt = async (password) => {
  return await bcrypt.hash(password, 12);
};

const validateUsername = async (username) => {
  let a = false;

  do {
    let check = await User.findOne({ username });
    if (check) {
      username += (new Date().getTime() * Math.random())
        .toString()
        .substring(0, 3);

      a = true;
    } else {
      a = false;
    }
  } while (a);

  return username.toLowerCase();
};

module.exports = {
  emailValid,
  emailNotUnique,
  validateLength,
  Crypt,
  validateUsername,
};
