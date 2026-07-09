const mongoose = require("mongoose");

const VenueSchema = new mongoose.Schema({
  name: String,
  address: String,
  capacity: Number,
  type: { type: String, enum: ["Indoor", "Outdoor"] },
});

module.exports = mongoose.model("Venue", VenueSchema);
