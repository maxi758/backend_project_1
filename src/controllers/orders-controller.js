const HttpError = require("../models/http-error");
const Order = require('../models/order');
const Product = require('../models/product')

const getOrders = async (req, res, next) => {
    let orders;
    try {
        orders = await Order.find();
    } catch (err) {
        const error = new HttpError('Fetch failed', 500);
        return next(error);
    }
    if (orders.length === 0) {
        const error = new HttpError('No orders found', 404);
        return next(error);
    }
    res.status(200).json({ orders: orders.map( order => order.toObject({getters: true}) )})
}

const getOrderById = async (req, res, next) => {
    const {oid} = req.params;
    let order;
    try {
        order = await Order.findById(oid);
    } catch (err) {
        const error = new HttpError('Fetch failed', 500);
        return next(error);
    }
    
    if (!order) {
        const error = new HttpError('Could not find a order for the given id', 404);
        return next(error);
    }
    res.status(200).json({order});
}

const createOrder = async (req, res, next) => {
    let order = new Order();
    try {
        const result = order.save();
    } catch (err) {
        const error = new HttpError('Creation failed', 500);
        return next(error);
    }
    res.status(201).json({order});
}

const addProduct = async (req, res, next) => {
    const {pid, oid} = req.params;
    let product, order, result;
    try {
        product = await Product.findById(pid);
        order = await Order.findById(oid);
    } catch (err) {
        const error = new HttpError('Fetch failed', 500);
        return next(error);
    }

    if (!order) {
        const error = new HttpError('Could not find a order for the given id', 404);
        return next(error);
    }

    if (!product) {
        const error = new HttpError('Could not find a product for the given id', 404);
        return next(error);
    }

    try {
        order.products.push(product);
        result = await order.save();
    } catch (err) {
        const error = new HttpError('Could not add the product to the order', 500);
        return next(error);
    }

    res.status(200).json({order: result});
}

const updateOrderProducts = async (req, res, next) => {
    const {oid} = req.params;
    const {products} = req.body;
    let order;
    try {
        order = Order.findById(oid);
    } catch (err) {
        const error = new HttpError('Fetch failed', 500);
        return next(error);
    }
    if (!order) {
        const error = new HttpError('Could not find a order for the given id', 404);
        return next(error);
    }
    const difference = products.filter( product => !order.products.include(product));
    order.products.concat(difference);
    try {
        await order.save();
    } catch (err) {
        const error = new HttpError('Update failed', 500);
        return next(error);
    }
    res.status(200).json({order});
}
const removeProduct = async (req, res, next) => {
    const {pid, oid} = req.params;
    let product, order, result;
    try {
        product = await Product.findById(pid);
        order = await Order.findById(oid);
    } catch (err) {
        const error = new HttpError('Fetch failed', 500);
        return next(error);
    }

    if (!order) {
        const error = new HttpError('Could not find a order for the given id', 404);
        return next(error);
    }

    if (!product) {
        const error = new HttpError('Could not find a product for the given id', 404);
        return next(error);
    }

    try {
        order.products = order.products.filter( product => product !== pid);
        result = await order.save();
    } catch (err) {
        const error = new HttpError('Could not add the product to the order', 500);
        return next(error);
    }

    res.status(200).json({order: result});
}

const removeOrderProducts = async (req, res, next) => {
    const {oid} = req.params;
    let order;
    try {
        order = Order.findByIdAndUpdate(oid, {products: []}, {new: true});
    } catch (err) {
        const error = new HttpError('Delete failed', 500);
        return next(error);
    }
    if (!order) {
        const error = new HttpError('Could not find a order for the given id', 404);
        return next(error);
    }
    res.status(200).json({order});
}

const deleteOrder = async (req, res, next) => {
    const {oid} = req.params;
    let result;
    try {
        result = Order.findByIdAndDelete(oid)
    } catch (err) {
        const error = new HttpError('Delete failed', 500);
        return next(error);
    }
    res.status(200).json({result});
}

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    addProduct,
    updateOrderProducts,
    removeProduct,
    removeOrderProducts,
    deleteOrder
}
