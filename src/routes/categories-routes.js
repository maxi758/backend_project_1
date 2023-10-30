const express = require('express');

const {getCategories, createCategory, updateCategory} = require('../controllers/categories-controller');

const router = express.Router();

router.get('/', getCategories);
router.post('/', createCategory);
router.patch('/:pid', updateCategory);

module.exports = router;