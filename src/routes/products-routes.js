const express = require("express");

const {
  getProducts,
  getProductById,
  getProductsByCategory,
} = require("../controllers/products-controller");

const route = express.Router();

route.get('/', getProducts);
route.get('/pid', getProductById);
route.get('/categories/:id', getProductsByCategory);

module.exports = route;