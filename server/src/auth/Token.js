const jsonwebtoken = require("jsonwebtoken");

const generateToken = (payload, expired) => {
  return jsonwebtoken.sign(payload, process.env.TOKEN_KEY, {
    expiresIn: expired,
  });
};

module.exports = {
  generateToken,
};
