const mongoose = require("mongoose");

const schema = mongoose.Schema;

const orderSchema = new schema({
    product: [{ type: mongoose.Types.ObjectId, required: true, ref: "Product" }],
    quantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    });

module.exports = mongoose.model("Order", orderSchema);