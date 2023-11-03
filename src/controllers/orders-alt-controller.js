const HttpError = require("../models/http-error");
const Order = require("../models/order");
const Product = require("../models/product");

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

module.exports = {
  createOrder,
};
