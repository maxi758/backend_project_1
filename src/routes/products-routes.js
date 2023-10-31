const express = require("express");

const {
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct
} = require("../controllers/products-controller");

const route = express.Router();

route.get('/', getProducts);

route.get('/:pid', getProductById);

route.get('/categories/:cid', getProductsByCategory);

route.post('/', createProduct);

module.exports = route;