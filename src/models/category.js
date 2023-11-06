const mongoose = require("mongoose");
const Product = require("./product");
const schema = mongoose.Schema;

const categorySchema = new schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
// se ejecuta antes que el update para actualizar la fecha
categorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  let now = Date.now();
  update.updatedAt = now;
  // Call the next function in the pre-save chain
  next();
});


categorySchema.pre("findOneAndDelete", async function (next) {

  const doc = await this.model.findOne(this.getFilter());
  await Product.updateMany({ category: doc._id }, { category: null });
  next();
});

module.exports = mongoose.model("Category", categorySchema);
