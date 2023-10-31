const mongoose = require("mongoose");

const schema = mongoose.Schema;

const orderSchema = new schema({
    quantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    product: [{ type: mongoose.Types.ObjectId, required: true, ref: "Product" }],
    });

module.exports = mongoose.model("Order", orderSchema);