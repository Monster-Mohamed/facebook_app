const { generateToken } = require("../auth/Token");
const jsonwebtoken = require("jsonwebtoken");

// for .env file
// added this require here because the file doesn't read .env variables
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");
const {
  emailValid,
  emailNotUnique,
  validateLength,
  Crypt,
  validateUsername,
} = require("../auth/AuthValidation");
const { sendVerificationEmail } = require("../auth/Mailer");
const Message = require("../helpers/Message");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  // Todo: register the user
  try {
    const email = req.body.email;

    if (!emailValid(email)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    if (await emailNotUnique(email)) {
      return res.status(400).json({
        message:
          "The email address already exists, try a different email address",
      });
    }

    if (!validateLength(req.body.first_name, 3, 30)) {
      return res.status(400).json({
        message: "first name must between 3 and 30 characters.",
      });
    }

    if (!validateLength(req.body.last_name, 3, 30)) {
      return res.status(400).json({
        message: "last name must between 3 and 30 characters.",
      });
    }

    if (!validateLength(req.body.password, 6, 100)) {
      return res.status(400).json({
        message: "password must be at least 6 characters",
      });
    }

    // encrypt the password by Crypt method
    const hashedPass = await Crypt(req.body.password);

    let username = req.body.first_name + req.body.last_name;

    let newUsername = await validateUsername(username);

    const user = await new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: email,
      password: hashedPass,
      username: newUsername,
      bYear: req.body.bYear,
      bMonth: req.body.bMonth,
      bDay: req.body.bDay,
      gender: req.body.gender,
    }).save();

    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );

    const url = `${process.env.ALLOWED_WEBSITE}/activate/${emailVerificationToken}`;

    sendVerificationEmail(user.email, user.first_name, url);

    const token = generateToken({ id: user._id.toString() }, "7d");

    res.json({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
      verified: user.verified,
      message: "Register Success ! please activate your email to start",
    });
  } catch (err) {
    Message(res, 500, error.message);
  }
};

const activateAccount = async (req, res) => {
  // Todo: activate the account
  try {
    const { token } = req.body;
    const user = jsonwebtoken.verify(token, process.env.TOKEN_KEY);
    const check = await User.findById(user.id);
    if (check.verified == true) {
      return Message(res, 400, "This account is already activated!");
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      return Message(res, 200, "Account has been activated successfully!");
    }
  } catch (error) {
    Message(res, 500, error.message);
  }
};

const login = async (req, res) => {
  // Todo: login the user
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return Message(res, 400, "This email address you entered is not exists");
    } else {
      const check = await bcrypt.compare(password, user.password);
      if (!check) {
        return Message(res, 400, "The password is incorrect please try again");
      } else {
        const token = generateToken({ id: user._id.toString() }, "7d");

        res.json({
          id: user._id,
          username: user.username,
          picture: user.picture,
          first_name: user.first_name,
          last_name: user.last_name,
          token: token,
          verified: user.verified,
          message: "You are logged in successfully!",
        });
      }
    }
  } catch (error) {
    Message(res, 500, error.message);
  }
};

module.exports = {
  register,
  login,
  activateAccount,
};
