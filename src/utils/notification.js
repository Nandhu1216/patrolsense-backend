const admin = require("./firebase");

const sendNotification = async (tokens, title, body) => {
  try {

    await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title,
        body
      }
    });

    console.log("✅ Notification sent");

  } catch (err) {
    console.log("❌ Notification error:", err);
  }
};

module.exports = sendNotification;