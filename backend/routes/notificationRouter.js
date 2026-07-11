const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  getNotifications,
  markAsRead,
  deleteNotification,
  clearAllNotifications,
} = require("../controllers/notificationController");
const {
  markNotificationReadValidator,
  deleteNotificationValidator
} = require("../validators/notification.validator");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

// GET notifications
router.get("/", auth, getNotifications);

// MARK AS READ
router.put("/:id", auth, markNotificationReadValidator, validateRequest, markAsRead);

// DELETE ALL notifications (MUST be before /:id)
router.delete("/clear-all", auth, clearAllNotifications);

// DELETE notification
router.delete("/:id", auth, deleteNotificationValidator, validateRequest, deleteNotification);

module.exports = router;