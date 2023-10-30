const HttpError = require("../models/http-error");

const Category = require("../models/category");

const getCategories = async (req, res, next) => {
  let categories;
  try {
    categories = Category.find();
  } catch (err) {
    const error = new HttpError('Fetch failed', 500);
		return next(error);
  }
  res.status(200).json({
    categories: categories.map((category) =>
      category.toObject({ getters: true })
    ),
  });
};
