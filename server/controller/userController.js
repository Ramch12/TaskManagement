const handleCatchAsync = require("../helpers/catchAsynHandler");
const authService = require("../service/auth");
const { HTTP_STATUS, sendResponse } = require("../utils/message");

const userSignUpController = handleCatchAsync(async (req, res) => {
  const data = req.body;
  const result = await authService.signUpUser(data, res);
  if (!result.flag) {
    return sendResponse({
      res,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message: "User Already exists",
    });
  }
  return sendResponse({
    res,
    statusCode: HTTP_STATUS.CREATED,
    user: result.user,
    token: result.token,
    status:true
  });
});


const userLoginController = handleCatchAsync(async (req, res) => {
  const data = req.body;
  const result = await authService.loginUser(data, res);
  if (!result.flag) {
    return sendResponse({
      res,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message: "Wrong credentials provided!",
    });
  }
  return sendResponse({
    res,
    statusCode: HTTP_STATUS.CREATED,
    user: result.user,
    token: result.token,
    status:true 
  });
});

module.exports = {
  userSignUpController,
  userLoginController,
};
