const mongoose = require("mongoose");

const schema = mongoose.Schema;

const productSchema = new schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: {type: Number, required: true},
  stock: {type: Number, required: true},
  image: { type: String, required: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  category: { type: mongoose.Types.ObjectId, required: false, ref: "Category" } // Parent referencing, porque puede haber muchos productos y no es bueno para la performance 
  //tener un array con tantos elementos en el Schema de Category, por lo cual se referencia a su id en Product
});

module.exports = mongoose.model('Product', productSchema);