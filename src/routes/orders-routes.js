const express = require("express");

const { check, body, query } = require("express-validator");
const {
  createEmptyOrder,
  addProduct,
  updateOrderProducts,
  removeProduct,
  deleteOrder,
} = require("../controllers/orders-controller");
const {
  createOrder,
  getOrders,
  getOrderById,
  removeOrderProducts,
} = require("../controllers/orders-alt-controller");
const { validate, paginateValidator } = require("../utils/validator");

const route = express.Router();

route.post(
  "/",
  [
    body().custom((value, { req }) => {
      // verifico que el body este vacío (revisar si es necesario)
      if (Object.keys(req.body).length !== 0) {
        throw new Error("Request body is not empty");
      }
      return true;
    }),
    validate,
  ],
  createEmptyOrder
);

route.patch(
  "/:oid/products/",
  [
    check(["oid"]).isMongoId(),
    check("products").isArray({ min: 1, max: 200 }),
    check("products.*").isObject(),
    check("products.*.product").isMongoId(),
    check("products.*.qty").isInt({ min: 1, max: 100 }).optional(),
    validate,
  ],
  addProduct
);
route.patch(
  "/:oid",
  check(["oid"]).isMongoId(),
    check("products").isArray({ min: 1, max: 200 }),
    check("products.*").isObject(),
    check("products.*.product").isMongoId(),
    check("products.*.qty").isInt({ min: 1, max: 100 }),
  updateOrderProducts
);
route.delete(
  "/:oid/products/:pid",
  [check(["oid", "pid"]).isMongoId(), validate],
  removeProduct
);

route.delete("/:oid", [check("oid").isMongoId(), validate], deleteOrder);

//Endpoint del servicio de ordenes alternativo (no requeridos en la entrega)

route.get("/", [paginateValidator], getOrders);

route.get("/:oid", [check("oid").isMongoId(), validate], getOrderById);

route.post(
  "/products",
  [
    check("products").isArray({ min: 1, max: 200 }),
    check("products.*").isObject(),
    check("products.*.product").isMongoId(),
    check("products.*.qty").isInt({ min: 1, max: 100 }).optional(),
    validate,
  ],
  createOrder
);
//vacía la orden de productos
route.delete(
  "/:oid/products/",
  [check("oid").isMongoId(), validate],
  removeOrderProducts
);

module.exports = route;
