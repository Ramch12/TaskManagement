const jwt = require("jsonwebtoken");
const authentication = async (req, res, next) => {
  try {
    const authentication = req.headers['authorization'];
    if (!authentication) {
      return res.status(400).json({
        status: false,
        message: "No token provided",
      });
    }
    const token = authentication.split(" ")[1];
    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Invalid token provided",
      });
    }
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('error', error);
    throw new Error("Invalid token provided");
  }
};

module.exports = {
  authentication,
};
