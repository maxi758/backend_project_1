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
    categories: categories.map((category) =>
      category.toObject({ getters: true })
    ),
  });
};

const getCategoryById = async (req, res, next) => {
  let category;
  const { cid } = req.params;
  try {
    category = await Category.findById(cid).exec();
  } catch (err) {
    const error = new HttpError("Fetch failed", 500);
    return next(error);
  }
  if (!category) {
    const error = new HttpError("Category with given id was not found", 404);
    return next(error);
  }
	console.log(category);
  res.status(200).json({ category: category.toObject({ getters: true }) });
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
  res.status(201).json({ category });
};

const updateCategory = async (req, res, next) => {
  const { cid } = req.params;
  const propertiesToUpdate = req.body;
  let updatedCategory;
  console.log(propertiesToUpdate);
  try {
    updatedCategory = await Category.findByIdAndUpdate(
      cid,
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
  //const updatedCategory = await Category.findOneAndUpdate({_id: cid}, propertiesToUpdate, {new: true});
  res.status(200).json({ updatedCategory });
};

const deleteCategory = async (req, res, next) => {
  const { cid } = req.params;
  let deletedCategory;
  try {
    deletedCategory = await Category.findByIdAndDelete(cid);
  } catch (err) {
    const error = new HttpError("Delete failed", 500);
    return next(error);
  }
  if (!deletedCategory) {
    const error = new HttpError("Category with given id was not found", 404);
    return next(error);
  }
  res.status(200).json({ deletedCategory });
};

module.exports = {
  getCategories,
	getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
