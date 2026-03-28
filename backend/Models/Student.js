const connectDB = require("../Config/db");
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date(),
    },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;