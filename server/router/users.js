const express = require("express");
const { validate } = require("../middleware/schameValidate");
const schema = require("../validate/user");
const {
  userLoginController,
  userSignUpController,
} = require("../controller/userController");

const userRoute = express.Router();
 
userRoute.post(
  "/signup",
  validate(schema.validateSignUpUser),
  userSignUpController
);
userRoute.post(
  "/login",
  validate(schema.validateSignInuser),
  userLoginController
);

module.exports = {
  userRoute,
};
