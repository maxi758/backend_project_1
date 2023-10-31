const express = require("express");

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
route.post("/", createOrder);
route.patch("/:oid/products/pid", addProduct);
route.patch("/:oid", updateOrderProducts);
route.delete("/:oid/product/pid", removeProduct);
route.delete("/:oid", deleteOrder);
