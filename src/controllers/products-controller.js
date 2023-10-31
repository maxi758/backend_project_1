const { async } = require("rxjs");
const HttpError = require("../models/http-error");
const product = require("../models/product");
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
    product = await Product.findById(pid);
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

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct
};
