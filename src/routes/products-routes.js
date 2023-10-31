const express = require("express");

const {
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/products-controller");

const route = express.Router();

route.get('/', getProducts);

route.get('/:pid', getProductById);

route.get('/categories/:cid', getProductsByCategory);

route.post('/', createProduct);

route.patch('/:pid', updateProduct);

route.delete('/:pid', deleteProduct);

module.exports = route;