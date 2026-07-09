const mongoose = require("mongoose");

const SportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Indoor", "Outdoor"] },
  playersPerTeam: Number,
});

module.exports = mongoose.model("Sport", SportSchema);
