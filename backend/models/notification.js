const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: String,
  type: String, // join_request, approval, etc.
  isRead: {
    type: Boolean,
    default: false,
  },
  relatedId: mongoose.Schema.Types.ObjectId, // teamId
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);