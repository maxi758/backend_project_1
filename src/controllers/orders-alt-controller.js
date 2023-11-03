const HttpError = require("../models/http-error");
const Order = require("../models/order");
const Product = require("../models/product");

const getOrders = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  let orders;
  try {
    orders = await Order.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
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
  let order,
    count = 0,
    sum = 0;
  try {
    order = await Order.findById(oid).populate("products");
    count = await Order.countDocuments({ _id: oid });
  } catch (err) {
    const error = new HttpError("Fetch failed", 500);
    return next(error);
  }

  if (!order) {
    const error = new HttpError("Could not find a order for the given id", 404);
    return next(error);
  }
  sum = order.products.reduce((acc, product) => acc + product.price, 0); //Suma de los precios de los productos, acc es el acumulador y empieza desde 0
  res
    .status(200)
    .json({ order: order.toObject({ getters: true }), count, totalToPay: sum });
};

const createOrder = async (req, res, next) => {
  const { products } = req.body;
  let orderCreated;
  let order = new Order();
  if (products && products.length !== 0) {
    try {
      const result = await Product.find({ _id: { $in: products } }); //verfico  que existan los productos
      if (result.length !== products.length) {
        // si no son iguales es porque no existen todos los productos, entonces no se crea la orden
        const error = new HttpError("Fetch failed: id not found", 404);
        return next(error);
      }
      order.products = products; // agrego los productos a la orden
    } catch (err) {
      const error = new HttpError("Fetch failed", 500);
      return next(error);
    }
  }

  try {
    orderCreated = await order.save(); // creo la orden en la base de datos
  } catch (err) {
    const error = new HttpError("Creation failed", 500);
    return next(error);
  }
  orderCreated = await orderCreated.populate("products"); // obtengo los productos de la orden
  res.status(201).json({ order: orderCreated });
};

//Elimina todos los productos de una orden
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

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  removeOrderProducts,
};
