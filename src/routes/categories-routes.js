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
router.get("/:cid", getCategoryById);
router.post("/", createCategory);
router.patch("/:cid", updateCategory);
router.delete("/:cid", deleteCategory);

module.exports = router;
