const HttpError = require("../models/http-error");
const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");

const createEmptyOrder = async (req, res, next) => {
  let orderCreated;
  let order = new Order({
    products: [],
  });
  try {
    orderCreated = await order.save(); // creo la orden en la base de datos
  } catch (err) {
    const error = new HttpError("Creation failed", 500);
    return next(error);
  }
  res.status(201).json({ order: orderCreated });
};

const addProduct = async (req, res, next) => {
  const { oid } = req.params;
  const { products } = req.body;
  let product, order, result;

  //product = products.map((product) => new mongoose.Types.ObjectId(product.product));
  try {
    product = await Product.find({ _id: { $in: products._id } });
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
  products.forEach((product) => {
    console.log(product);
    order.products.push(product);
  });

  try {
    result = await order.save();
  } catch (err) {
    const error = new HttpError("Could not add the product to the order", 500);
    return next(error);
  }

  res.status(200).json({ order: result });
};

const updateOrderProducts = async (req, res, next) => {
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
    const error = new HttpError(
      "Error: given id were already added to the order",
      404
    );
    return next(error);
  }
  try {
    result = await Product.find({ _id: { $in: difference } }); // busca por los productos que estan en el array difference
  } catch (err) {
    const error = new HttpError(
      "Fetch failed: id does not have the correct format",
      500
    );
    return next(error);
  }

  console.log(result);
  if (result.length !== difference.length) {
    const error = new HttpError(
      "Error: one of the id does not match with a existing product",
      404
    );
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
  let order, result, productFound;
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

  productFound = order.products.find((product) => product.toString() === pid);
  if (!productFound) {
    const error = new HttpError(
      "Could not find a product for the given id in the order",
      404
    );
    return next(error);
  }
  order.products = order.products.filter(
    (product) => product.toString() !== pid
  );
  
  try {
    result = await order.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Could not remove the product from the order",
      500
    );
    return next(error);
  }

  res.status(200).json({ order: result });
};

const deleteOrder = async (req, res, next) => {
  const { oid } = req.params;
  let orderDeleted;
  try {
    orderDeleted = await Order.findByIdAndDelete(oid);
  } catch (err) {
    const error = new HttpError("Delete failed", 500);
    return next(error);
  }
  if (!orderDeleted) {
    const error = new HttpError("Could not find a order for the given id", 404);
    return next(error);
  }
  res.status(200).json({ orderDeleted });
};

module.exports = {
  createEmptyOrder,
  addProduct,
  updateOrderProducts,
  removeProduct,
  deleteOrder,
};
