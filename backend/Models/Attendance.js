const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Absent', 'Late-1hr', 'Late-2hrs', 'Present', 'Late-30mins', 'Permission'],
        default: null,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    locked: {
        type: Boolean,
        default: false,
    },
});

attendanceSchema.index({ student: 1, day: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;