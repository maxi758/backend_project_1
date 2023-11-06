const express = require("express");
const { check, body, query, oneOf } = require("express-validator");
const { validate, paginateValidator } = require("../utils/validator");
const {
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products-controller");

const route = express.Router();

route.get(
  "/",
  [
    paginateValidator
  ],
  getProducts
);

route.get("/:pid", [check("pid").isMongoId(), validate], getProductById);

route.get(
  "/categories/:cid",
  [check("cid").isMongoId(), validate],
  getProductsByCategory
);

route.post(
  "/",
  [
    check("name").trim().not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("price").isFloat({ min: 0 }),
    check("stock").isInt({ min: 0 }),
    check("image").isURL(),
    check("category").isMongoId(),
    validate,
  ],
  createProduct
);

route.patch(
  "/:pid",
  [
    check("pid").isMongoId(),
    oneOf([
      check("name").trim().not().isEmpty(),
      check("description").isLength({ min: 5 }),
      check("price").isFloat({ min: 0 }),
      check("stock").isInt({ min: 0 }),
      check("image").isURL(),
      check("category").isMongoId(),
    ]),
    body().custom((value, { req }) => {
      if (Object.keys(req.body).length === 0) {
        throw new Error("Request body is empty");
      }
      return true;
    }),
    validate,
  ],
  updateProduct
);

route.delete("/:pid", [check("pid").isMongoId(), validate], deleteProduct);

module.exports = route;
