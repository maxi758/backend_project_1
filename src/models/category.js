const mongoose = require("mongoose");

const schema = mongoose.Schema;

const categorySchema = new schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  product: [{ type: mongoose.Types.ObjectId, required: true, ref: "Product" }],
});

categorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  let now = Date.now();
  update.updatedAt = now;
  // Call the next function in the pre-save chain
  next();
});

module.exports = mongoose.model("Category", categorySchema);
