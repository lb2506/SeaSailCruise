const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userFirstName: { type: String, required: true },
    userLastName: { type: String, required: true },
    products: [],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    // shipping: { type: Object, required: true },
    order_status: { type: String, default: "pending" },
    payment_status: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Orders", orderSchema);

exports.Order = Order;
