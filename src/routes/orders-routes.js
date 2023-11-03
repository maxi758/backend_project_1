const express = require("express");

const { check, body, query } = require("express-validator");
const {
  getOrders,
  getOrderById,
  createEmptyOrder,
  addProduct,
  updateOrderProducts,
  removeProduct,
  removeOrderProduct,
  deleteOrder,
} = require("../controllers/orders-controller");
const {createOrder} = require("../controllers/orders-alt-controller");
const { validate, paginateValidator } = require("../utils/validator");

const route = express.Router();

route.get("/", [paginateValidator], getOrders);
route.get("/:oid", getOrderById);

route.post(
  "/",
  [
    body().custom((value, { req }) => { // verifico que el body este vacío (revisar si es necesario)
      if (Object.keys(req.body).length !== 0) {
        throw new Error("Request body is not empty");
      }
      return true;
    }),
    validate,
  ],
  createEmptyOrder
);

route.post("/products",
    [
        check("products").isArray({ min: 1, max: 200 }).isMongoId(),
        validate,
    ],
 createOrder);

route.patch("/:oid/products/:pid", addProduct);
route.patch(
  "/:oid",
  [
    check("products").isArray({ min: 1, max: 200 }).isMongoId(), // verifico que el body tenga un array de productos con al menos un elemento
    validate,
  ],
  updateOrderProducts
);
route.delete("/:oid/products/:pid", removeProduct);
route.delete("/:oid", deleteOrder);

module.exports = route;
