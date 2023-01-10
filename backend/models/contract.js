const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

const Contract = mongoose.model("Contracts", contractSchema);

exports.Contract = Contract;