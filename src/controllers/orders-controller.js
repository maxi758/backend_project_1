const HttpError = require("../models/http-error");
const Order = require("../models/order");
const Product = require("../models/product");

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
  let product, order, result, foundProducts;

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

  foundProducts = order.products.filter((product) =>
    products.filter((x) => x.product === product)
  );

  products.forEach((product) => {
    const found = order.products.find(
      (x) => x.product.toString() === product.product
    );
    if (!found) {
      order.products.push(product);
    } else {
      found.qty = found.qty + (product.qty || 1);
    }
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
  let order, existingProducts, incomingProducts, result;
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

  const filteredProducts = products.reduce((acc, product) => {
    if (!acc.some((x) => x.product === product.product)) {
      acc.push(product);
    }
    return acc;
  }, []);
  // eliminar productos de products cuyo product este repetido

  const arrayObjectId = order.products.map((x) => x.product.toString()); //Para no saturar el filter con tantas funciones

  const difference = filteredProducts.filter(
    (product) => !arrayObjectId.includes(product.product)
  );

  const existing = filteredProducts.filter((product) =>
    arrayObjectId.includes(product.product)
  );
  const incomingProductsIds = difference.map((product) => product.product);
  const existingProductsIds = existing.map((product) => product.product);

  try {
    existingProducts = await Product.find({
      _id: { $in: existingProductsIds },
    }); // busca por los productos que estan en la orden
    incomingProducts = await Product.find({
      _id: { $in: incomingProductsIds },
    }); // busca por los productos que no estaban en la orden
  } catch (err) {
    const error = new HttpError(
      "Fetch failed: id does not have the correct format",
      500
    );
    return next(error);
  }

  if (
    filteredProducts.length !==
    existingProducts.length + incomingProducts.length
  ) {
    const error = new HttpError(
      "Error: one of the id does not match with a existing product",
      404
    );
    return next(error);
  }

  order.products.push(...difference);

  existing.forEach((product) => {
    const found = order.products.find(
      (x) => x.product.toString() === product.product
    );
    found.qty = product.qty || found.qty;
  });

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

  productFound = order.products.find((product) => product.product.toString() === pid);
  if (!productFound) {
    const error = new HttpError(
      "Could not find a product for the given id in the order",
      404
    );
    return next(error);
  }
  order.products = order.products.filter(
    (product) => product.product.toString() !== pid
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
