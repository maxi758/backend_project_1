const mongoose = require("mongoose");

const schema = mongoose.Schema;

const orderSchema = new schema({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    products: [{ type: mongoose.Types.ObjectId, required: false, ref: "Product" }], // Child reference, porque no serán tantos los productos en cada compra
    });

module.exports = mongoose.model("Order", orderSchema);