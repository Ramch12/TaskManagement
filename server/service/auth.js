const User = require("../models/user");
const Role = require("../models/role");
const { ROLE_CONSTANS } = require("../config/constants/roleConstants");

const signUpUser = async (data, res) => {
  try {
    const { email, mobile } = data;
    const isUserExists = await User.findOne({
      $or: [{ email }, { mobile }],
    });
    if (isUserExists) {
      return {
        flag: false,
        message: "User already exists!",
      };
    }
    const userRole = await Role.findOne({
      code: ROLE_CONSTANS.USER,
    });
    const user = await User.create({ ...data, role: userRole._id });
    return {
      flag: true,
      message: "User successfully signup!",
      token: user.generateToken(),
      user,
    };
  } catch (err) {
    throw err;
  }
};

const loginUser = async (data, res) => {
  try {
    const { email, password } = data;
    const isUserExists = await User.findOne({
      email,
    });
    if (!isUserExists) {
      return {
        flag: false,
        message: "No user found",
      };
    }
    const isPassMatch = await isUserExists.isPassMatch(password);
    if (!isPassMatch) {
      return {
        flag: false,
        message: "invalid cred provided!",
      };
    }
    return {
      flag: true,
      token: isUserExists.generateToken(),
      user: isUserExists,
      message: "Successfully login",
    };
  } catch (err) {
    console.log("Error signUpUser", err);
    throw err;
  }
};

module.exports = {
  loginUser,
  signUpUser,
};
