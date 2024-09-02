const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// GET all products and render the list view
router.get('/list', async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.render('products/list', { products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET form to add a new product
router.get('/add', async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('products/add', { categories });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new product
router.post('/', async (req, res) => {
    try {
        const { name, price, description, category } = req.body;
        const newProduct = new Product({
            name,
            price,
            description,
            category,
        });
        await newProduct.save();
        res.redirect('/products/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET form to edit an existing product
router.get('/edit/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        const categories = await Category.find();
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.render('products/edit', { product, categories });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT update an existing product
router.put('/:id', async (req, res) => {
    try {
        const { name, price, description, category } = req.body;
        await Product.findByIdAndUpdate(req.params.id, { name, price, description, category }, { new: true });
        res.redirect('/products/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE an existing product
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/products/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
