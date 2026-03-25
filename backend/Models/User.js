const connectDB = require("../Config/db");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    telegram_id: {
        type: String,
        unique: true,
        sparse: true
    },
    role: {
        type: String,
        enum: ['Editor', 'Admin', 'Visitor'],
        default: 'Visitor',
        required: true,
    },
    student_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;