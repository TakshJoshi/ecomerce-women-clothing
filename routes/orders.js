const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/user');

// GET all orders and render the list view
router.get('/list', async (req, res) => {
    try {
        const orders = await Order.find().populate('user').populate('items.product');
        res.render('orders/list', { orders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific order's details
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user').populate('items.product');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.render('orders/details', { order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET form to add a new order
router.get('/add', async (req, res) => {
    try {
        const products = await Product.find();
        const users = await User.find();
        res.render('orders/add', { products, users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new order
router.post('/', async (req, res) => {
    try {
        const { user, products } = req.body;
        const items = products.map(productId => ({
            product: productId,
            quantity: req.body[`quantity_${productId}`] || 1
        }));
        const newOrder = new Order({ user, items });
        await newOrder.save();
        res.redirect('/orders/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET form to edit an existing order
router.get('/edit/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user').populate('items.product');
        const products = await Product.find();
        const users = await User.find();
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.render('orders/edit', { order, products, users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT update an existing order
router.put('/:id', async (req, res) => {
    try {
        const { user, products } = req.body;
        const items = products.map(productId => ({
            product: productId,
            quantity: req.body[`quantity_${productId}`] || 1
        }));
        await Order.findByIdAndUpdate(req.params.id, { user, items }, { new: true });
        res.redirect('/orders/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET confirmation to delete an order
router.get('/delete/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user').populate('items.product');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.render('orders/delete', { order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE an existing order
router.delete('/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.redirect('/orders/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
