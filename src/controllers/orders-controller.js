const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Order = require("../models/order");
const Product = require("../models/product");

const getOrders = async (req, res, next) => {
  let orders;
  try {
    orders = await Order.find();
  } catch (err) {
    const error = new HttpError("Fetch failed", 500);
    return next(error);
  }
  if (orders.length === 0) {
    const error = new HttpError("No orders found", 404);
    return next(error);
  }
  res
    .status(200)
    .json({ orders: orders.map((order) => order.toObject({ getters: true })) });
};

const getOrderById = async (req, res, next) => {
  const { oid } = req.params;
  let order;
  try {
    order = await Order.findById(oid);
  } catch (err) {
    const error = new HttpError("Fetch failed", 500);
    return next(error);
  }

  if (!order) {
    const error = new HttpError("Could not find a order for the given id", 404);
    return next(error);
  }
  res.status(200).json({ order });
};

const createOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  let order = new Order();
  try {
    const result = order.save();
  } catch (err) {
    const error = new HttpError("Creation failed", 500);
    return next(error);
  }
  res.status(201).json({ order });
};

const addProduct = async (req, res, next) => {
  const { pid, oid } = req.params;
  let product, order, result;
  try {
    product = await Product.findById(pid);
    order = await Order.findById(oid);
  } catch (err) {
    const error = new HttpError("Fetch failed", 500);
    return next(error);
  }

  if (!order) {
    const error = new HttpError("Could not find a order for the given id", 404);
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      "Could not find a product for the given id",
      404
    );
    return next(error);
  }

  try {
    order.products.push(product);
    result = await order.save();
  } catch (err) {
    const error = new HttpError("Could not add the product to the order", 500);
    return next(error);
  }

  res.status(200).json({ order: result });
};

const updateOrderProducts = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }
  const { oid } = req.params;
  const { products } = req.body;
  let order, result;
  try {
    order = await Order.findById(oid);
  } catch (err) {
    const error = new HttpError("Fetch failed", 500);
    return next(error);
  }
  if (!order) {
    const error = new HttpError("Could not find a order for the given id", 404);
    return next(error);
  }

  const arrayObjectId = order.products.map((x) => x.toString()); //Para no saturar el filter con tantas funciones

  const difference = products.filter(
    (product) => !arrayObjectId.includes(product)
  );
  if (difference.length === 0) {
    const error = new HttpError("Error: given id were already added to the order", 404);
    return next(error);
  }
  try {
    result = await Product.find({ _id: { $in: difference } });
  } catch (err) {
    const error = new HttpError(
      "Fetch failed: id does not have the correct format",
      500
    );
    return next(error);
  }

  if (result.length !== products.length) {
    const error = new HttpError("Error: one of the id are invalid", 404);
    return next(error);
  }
  order.products.push(difference);
  try {
    await order.save();
  } catch (err) {
    const error = new HttpError("Update failed", 500);
    return next(error);
  }
  res.status(200).json({ order });
};

const removeProduct = async (req, res, next) => {
  const { pid, oid } = req.params;
  let product, order, result;
  try {
    product = await Product.findById(pid);
    order = await Order.findById(oid);
  } catch (err) {
    const error = new HttpError("Fetch failed", 500);
    return next(error);
  }

  if (!order) {
    const error = new HttpError("Could not find a order for the given id", 404);
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      "Could not find a product for the given id",
      404
    );
    return next(error);
  }

  try {
    order.products = order.products.filter(
      (product) => product.toString() !== pid
    );
    result = await order.save();
  } catch (err) {
    const error = new HttpError("Could not add the product to the order", 500);
    return next(error);
  }

  res.status(200).json({ order: result });
};

const removeOrderProducts = async (req, res, next) => {
  const { oid } = req.params;
  let order;
  try {
    order = Order.findByIdAndUpdate(oid, { products: [] }, { new: true });
  } catch (err) {
    const error = new HttpError("Delete failed", 500);
    return next(error);
  }
  if (!order) {
    const error = new HttpError("Could not find a order for the given id", 404);
    return next(error);
  }
  res.status(200).json({ order });
};

const deleteOrder = async (req, res, next) => {
  const { oid } = req.params;
  let result;
  try {
    result = await Order.findByIdAndDelete(oid);
  } catch (err) {
    const error = new HttpError("Delete failed", 500);
    return next(error);
  }
  res.status(200).json({ result });
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  addProduct,
  updateOrderProducts,
  removeProduct,
  removeOrderProducts,
  deleteOrder,
};
