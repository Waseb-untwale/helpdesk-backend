const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  note: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ticketSchema = new mongoose.Schema({
  name:{type:String},
  title: { type: String, required: true },
  status: { type: String, enum: ["Active", "Pending", "Closed"], default: "Active" },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  notes: [noteSchema],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", ticketSchema);
