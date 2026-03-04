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
    attendance: [{type: mongoose.Schema.ObjectId, ref: 'Attendance'}]
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;