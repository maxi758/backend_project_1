const express = require("express");

const { check, body, query } = require("express-validator");
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
const { validate } = require("../utils/validator");

const route = express.Router();

route.get(
  "/",
  [
    query("page").optional().isInt().escape(),
    query("limit").optional().isInt().escape(),
    validate
  ],
  getOrders
);
route.get("/:oid", getOrderById);
// i want to check to body is empty
route.post(
  "/",[
  body().custom((value, { req }) => {
    if (Object.keys(req.body).length !== 0) {
      throw new Error("Request body is not empty");
    }
    return true;
  }),
  validate],
  createOrder
);
route.patch("/:oid/products/:pid", addProduct);
route.patch(
  "/:oid",[
  check("products").isArray({ min: 1, max: 200 }).isMongoId(), //i could use this validation to avoid using it in the controller
    validate],
  updateOrderProducts
);
route.delete("/:oid/products/:pid", removeProduct);
route.delete("/:oid", deleteOrder);

module.exports = route;
