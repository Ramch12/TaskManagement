const { ROLE_CONSTANS } = require("../config/constants/roleConstants");
const Role = require("../models/role");
const authorization = async (req, res, next) => {
  try {
    const user = req.user;
    const userRole = await Role.findOne({
      _id: user.role
    }).lean();
    if (userRole.code === ROLE_CONSTANS.ADMIN) {
      next();
    } else {
      return res.status(401).json({
        status: false,
        message: "you are unauthorized for this operation",
      });
    }
  } catch (error) {
    console.log("error", error);
    throw new Error("Error in authorization");
  }
};

module.exports = {
  authorization,
};
