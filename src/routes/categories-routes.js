const express = require("express");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories-controller");

const router = express.Router();

router.get("/", getCategories);
router.get("/:pid", getCategoryById);
router.post("/", createCategory);
router.patch("/:pid", updateCategory);
router.delete("/:pid", deleteCategory);

module.exports = router;
