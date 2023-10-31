const express = require("express");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories-controller");

const router = express.Router();

router.get("/", getCategories);
router.post("/", createCategory);
router.patch("/:pid", updateCategory);
router.delete("/:pid", deleteCategory);

module.exports = router;
