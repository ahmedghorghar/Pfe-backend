// backend/logic/notification_routes.js

const pushNotificationController = require("../logic/puch-notifaication.controller");
const express = require('express');
const router = express.Router();

router.get("/SendNotification", pushNotificationController.SendNotification)
router.post("/SendNotificationTODevice", pushNotificationController.SendNotificationTODevice)


module.exports = router;