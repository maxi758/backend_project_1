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

const paginateValidator = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  if (isNaN(page) || isNaN(limit)) {
    const error = new HttpError("Invalid inputs passed, page and limit must be numbers", 422);
    return next(error);
  }
  next();
};

module.exports = {validate, paginateValidator};