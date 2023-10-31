const HttpError = require("../models/http-error");

const Category = require("../models/category");

const getCategories = async (req, res, next) => {
  let categories;
  try {
    categories = await Category.find();
  } catch (err) {
    const error = new HttpError("Fetch failed", 500);
    return next(error);
  }
  console.log(categories);
  if (categories.length === 0) {
    const error = new HttpError("No categories found", 404);
    return next(error);
  }
  res.status(200).json({
    categories /*: categories.map((category) =>
      category.toObject({ getters: true })
    ),*/,
  });
};

const createCategory = async (req, res, next) => {
  const { name, description } = req.body;
  let result;
  const category = new Category({
    name,
    description,
  });
  try {
    result = category.save();
  } catch (err) {
    const error = new HttpError("Creation failed", 500);
    return next(error);
  }
  res.status(201).json({ result });
};

const updateCategory = async (req, res, next) => {
  const { pid } = req.params;
  const propertiesToUpdate = req.body;
  let updatedCategory;
  console.log(propertiesToUpdate);
  try {
    updatedCategory = await Category.findByIdAndUpdate(
      pid,
      propertiesToUpdate,
      { new: true }
    );
  } catch (err) {
    const error = new HttpError("Update failed", 500);
    return next(error);
  }
  if (!updatedCategory) {
    const error = new HttpError("Category with given id was not found", 404);
    return next(error);
  }
  //const updatedCategory = await Category.findOneAndUpdate({_id: pid}, propertiesToUpdate, {new: true});
  res.status(200).json({ updatedCategory });
};

const deleteCategory = async (req, res, next) => {
	const { pid } = req.params;
	let deletedCategory;
	try {
		deletedCategory = await Category.findByIdAndDelete(pid);
	} catch (err) {
		const error = new HttpError("Update failed", 500);
    return next(error);
  }
  if (!deletedCategory) {
    const error = new HttpError("Category with given id was not found", 404);
    return next(error);
  }
	res.status(200).json({deletedCategory});
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
	deleteCategory
};
