const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }
  next();
};

module.exports = {validate};