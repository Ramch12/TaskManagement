const HandleError = (err, req, res, next) => {
  try {
    if (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  } catch (err) {
    console.log("Error - HandleError", err);
  }
};

module.exports = {
  HandleError,
};
