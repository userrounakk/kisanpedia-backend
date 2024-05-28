const jwt = require("jsonwebtoken");
function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

function verifyToken(token) {
  if (token) {
    try {
      let verified = jwt.verify(token, process.env.JWT_SECRET);
      return verified;
    } catch (e) {
      return null;
    }
  }
}
module.exports = { generateToken, verifyToken };
