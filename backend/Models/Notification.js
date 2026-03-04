const connectDB = require("../Config/db");
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    telegram_id: {
        type: String,
        required: true,
    },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;