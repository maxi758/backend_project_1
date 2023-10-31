const HttpError = require("../models/http-error");

const Product = require("../models/product");

const getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find();
  } catch (err) {
    const error = new HttpError("Fetch failed", 500);
    return next(error);
  }
  if (products.length === 0) {
    const error = new HttpError("No products found", 404);
    return next(error);
  }
  res.status(200).json({
    products: products.map((product) => product.toObject({ getters: true })),
  });
};

const getProductById = async (req, res, next) => {
  let product;
  const { pid } = req.params;
  try {
    product = await Product.findById(pid).populate('category');
  } catch (err) {
    const error = new HttpError("Fetch failed", 500);
    return next(error);
  }
  if (!product) {
    const error = new HttpError(
      "Could not find a product for the given id",
      404
    );
    return next(error);
  }
  res.status(200).json({ product });
};

const getProductsByCategory = async (req, res, next) => {
  let products;
  const { cid } = req.params;
  try {
    products = await Product.find({ category: cid });
  } catch (err) {
    const error = new HttpError("Fetch failed", 500);
    return next(error);
  }
  if (products.length === 0) {
    const error = new HttpError(
      "Could not find products for that category",
      404
    );
    return next(error);
  }
  res
    .status(200)
    .json({
      products: products.map((product) => product.toObject({ getters: true })),
    });
};

const createProduct = async (req, res, next) => {
  const {name, description, price, stock, image} = req.body;
  let result;
  const product = new Product({
    name,
    description,
    price,
    stock,
    image
  });
  if (req.body.category){
    product.category = req.body.category;
  }
  try {
    result = product.save();
  } catch (err) {
    const error = new HttpError("Creation failed", 500);
    return next(error);
  }
  res.status(201).json({product});
}

const updateProduct = async (req, res, next) => {
  const {pid} = req.params;
  const propertiesToUpdate = req.body;
  let product;
  try {
    product = await Product.findByIdAndUpdate(pid, propertiesToUpdate, {new: true});
  } catch (err) {
    const error = new HttpError("Update failed", 500);
    return next(error);
  }
  if (!product) {
    const error = new HttpError(
      "Could not find a product for the given id",
      404
    );
    return next(error);
  }
  res.status(200).json({product});
}

const deleteProduct = async (req, res, next) => {
  const { pid } = req.params;
  let deletedProduct;
  try {
    deletedProduct = await Product.findByIdAndDelete(pid);
  } catch (err) {
    const error = new HttpError("Delete failed", 500);
    return next(error);
  }
  if (!deletedProduct) {
    const error = new HttpError("Product with given id was not found", 404);
    return next(error);
  }
  res.status(200).json({ product: deletedProduct });
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
};
