// backend/logic/puch-notifaication.controller.js

const { ONE_SIGNAL_CONFIG } = require("../config/app.config");
const pushNotificationService = require("../services/puch-notifaication.services");

exports.SendNotification = async (req, res, next) => {
  var message = {
    app_id: ONE_SIGNAL_CONFIG.APP_ID,
    contents: { en: "TestPushNotification" },
    include_segments: ["ALL"],
    content_available: true,
    small_icon: "ic_notification_icon",
    data: {
      PushTitle: "Custom Notification",
    },
  };

  try {
    const results = await pushNotificationService.SendNotification(message);
    res.status(200).send({
      message: "Notification sent successfully",
      data: results,
    });
  } catch (error) {
    next(error);
  }
};


exports.SendNotificationTODevice = async (req, res, next) => {
  const message = {
    app_id: ONE_SIGNAL_CONFIG.APP_ID,
    contents: { en: "TestPushNotification" },
    include_segments: ["includs_player_ids"],
    includs_player_ids: req.body.devices,
    content_available: true,
    small_icon: "ic_notification_icon",
    data: {
      PushTitle: "Custom Notification",
    },
  };

  try {
    const results = await pushNotificationService.SendNotification(message);
    res.status(200).send({
      message: "Notification sent successfully",
      data: results,
    });
  } catch (error) {
    next(error);
  }

};
