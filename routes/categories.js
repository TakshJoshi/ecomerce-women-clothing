const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/product');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single category with associated products
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    const products = await Product.find({ category: req.params.id });
    res.render('categoryDetail', { category, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new category
router.post('/', async (req, res) => {
  const category = new Category(req.body);
  try {
    await category.save();
    res.redirect('/categories');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update a category
router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a category
router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
