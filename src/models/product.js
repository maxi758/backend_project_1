const mongoose = require("mongoose");

const schema = mongoose.Schema;

const productSchema = new schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: {type: Number, required: true},
  stock: {type: Number, required: true},
  image: { type: URL, required: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  category: { type: mongoose.Types.ObjectId, required: false, ref: "Category" }
});

module.exports = mongoose.Model('Product', productSchema);