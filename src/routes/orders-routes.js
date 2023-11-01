const express = require("express");

const { check, body } = require("express-validator");
const {
  getOrders,
  getOrderById,
  createOrder,
  addProduct,
  updateOrderProducts,
  removeProduct,
  removeOrderProduct,
  deleteOrder,
} = require("../controllers/orders-controller");

const route = express.Router();

route.get("/", getOrders);
route.get("/:oid", getOrderById);
route.post("/", check().isEmpty(), createOrder);
route.patch("/:oid/products/:pid", addProduct);
route.patch("/:oid", check("products").isArray({min:1, max:200}), updateOrderProducts);
route.delete("/:oid/products/:pid", removeProduct);
route.delete("/:oid", deleteOrder);

module.exports = route;
