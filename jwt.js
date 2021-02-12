const jwt = require('jsonwebtoken');

const SECRET = process.env.TOKEN_SECRET || 'Super(un)SecureSecret';
const OPTIONS = {
  expiresIn: '1d', // 1 day
};

function verify(token) {
  return jwt.verify(token, SECRET);
}

function sign(payload) {
  return jwt.sign(payload, SECRET, OPTIONS);
}

module.exports = {
  verify,
  sign,
};
