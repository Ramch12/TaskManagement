const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const data = req.body;
      const { error, value } = schema.validate(data);
      if (error) {
        return res.status(422).json({
          status: false,
          message: error.details[0].message,
        });
      }
      next();
    } catch (err) {
      throw err;
    }
  };
};

module.exports = {
  validate,
};
