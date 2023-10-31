const HttpError = require("../models/http-error");
const Order = require('../models/order');

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

module.exports = {
    getOrders,
    getOrderById
}
