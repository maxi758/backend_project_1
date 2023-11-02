const express = require("express");
const { check, oneOf, body } = require("express-validator");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories-controller");
const { validate } = require("../utils/validator");

const router = express.Router();

router.get("/", getCategories);
router.get("/:cid", [check("cid").isMongoId(), validate], getCategoryById);
router.post(
  "/",
  [
    check("name").trim().not().isEmpty(),
    check("description").isLength({ min: 5 }),
    validate,
  ],
  createCategory
);
router.patch(
  "/:cid",
  [
    check("cid").isMongoId(),
    check("name").trim().not().isEmpty().optional(),
    check("description").isLength({ min: 5 }).optional(),
    body().custom((value, { req }) => {
      if (Object.keys(req.body).length === 0) {
        throw new Error("Request body is empty");
      }
      return true;
    }),
    validate,
  ],
  updateCategory
);
router.delete("/:cid", [check("cid").isMongoId(), validate], deleteCategory);

module.exports = router;
