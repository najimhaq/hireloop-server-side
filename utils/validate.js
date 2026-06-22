const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body);

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = validate;
