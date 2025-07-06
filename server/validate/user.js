const joi = require("joi");

const validateSignUpUser = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  email: joi.string().required(),
  mobile:joi.string().required(),
  password: joi.string().required(),
})


const validateSignInuser = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});

module.exports = {
  validateSignUpUser,
  validateSignInuser,
};
