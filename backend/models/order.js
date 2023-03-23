const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: false },
    userFirstName: { type: String, required: true },
    userLastName: { type: String, required: true },
    products: [],
    subtotal: { type: Number, required: false },
    total: { type: Number, required: false },
    order_status: { type: String, default: "pending" },
    payment_status: { type: String, required: false },
    type: { type: String, required: true },
    contract: { type: Object, required: false }
  },
  { timestamps: true }
);

const Order = mongoose.model("Orders", orderSchema);

exports.Order = Order;