const Attendance = require("../Models/Attendance");
const Student = require("../Models/Student");
const dotenv = require("dotenv");

dotenv.config();


// Get attendance of specific student by ID
async function getFullStudentAttendance(req, res) {
    try {
        const { studentId } = req.body;
        
        const attendance = await Attendance.find({ student: studentId })
            .sort({ date: -1 });
        console.log(attendance);
        if (!attendance.length) {
            return res.status(404).json({ message: "No attendance records found" });
        }
        
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: "Error fetching attendance", error: error.message });
    }
}

// Create attendance for the whole year
async function createYearlyAttendance(req, res) {
    try {
        const { studentId, startDate, endDate } = req.body;
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        const attendanceRecords = [];
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            // count only weekends
            if (d.getDay() == 0 || d.getDay() == 6) {
                const day = d.toISOString().split("T")[0];
                attendanceRecords.push({
                    student: studentId,
                    day: day,
                    status: null
                });
            }
        }
        
        const result = await Attendance.insertMany(attendanceRecords);
        await Student.findByIdAndUpdate(studentId, { $push: { attendance: { $each: result.map(r => r._id) } } });
        res.status(201).json({ message: "Yearly attendance created", records: result.length });
    } catch (error) {
        if (error.code === 11000) {
            // Try to extract the conflicting key (student/day) and delete the existing record
            const key = error.keyValue
                || (error.writeErrors && error.writeErrors[0] && error.writeErrors[0].err && error.writeErrors[0].err.keyValue)
                || null;
            if (key && (key.student || key.day)) {
                try {
                    const filter = {};
                    if (key.student) filter.student = key.student;
                    if (key.day) filter.day = key.day;
                    const deleted = await Attendance.findOneAndDelete(filter);
                    return res.status(400).json({ message: "Duplicate attendance found — existing record deleted", deleted });
                } catch (delErr) {
                    return res.status(500).json({ message: "Duplicate attendance found but failed to delete existing record", error: delErr.message });
                }
            }
            return res.status(400).json({ message: "Attendance already recorded today" });
        }
        res.status(500).json({ message: "Error creating attendance", error: error.message });
    }
}

async function createYearlyAttendanceAll(req, res) {
    try {
        const { startDate, endDate } = req.body;
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        const students = await Student.find();
        let totalRecords = 0;
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            // count only weekends
            if (d.getDay() == 0 || d.getDay() == 6) {
                const day = d.toISOString().split("T")[0];
                const attendanceRecords = students.map(student => ({
                    student: student._id,
                    day: day,
                    status: null
                }));
                const result = await Attendance.insertMany(attendanceRecords);
                totalRecords += result.length;
                
                for (const student of students) {
                    const studentRecords = result.filter(r => r.student.toString() === student._id.toString());
                    await Student.findByIdAndUpdate(student._id, { $push: { attendance: { $each: studentRecords.map(r => r._id) } } });
                }
            }
        }
        res.status(201).json({ message: "Yearly attendance created successfully", records: totalRecords });
    } catch (error) {
        if (error.code === 11000) {
            // Try to extract the conflicting key (student/day) and delete the existing record
            const key = error.keyValue
                || (error.writeErrors && error.writeErrors[0] && error.writeErrors[0].err && error.writeErrors[0].err.keyValue)
                || null;
            if (key && (key.student || key.day)) {
                try {
                    const filter = {};
                    if (key.student) filter.student = key.student;
                    if (key.day) filter.day = key.day;
                    const deleted = await Attendance.findOneAndDelete(filter);
                    return res.status(400).json({ message: "Duplicate attendance found — existing record deleted", deleted });
                } catch (delErr) {
                    return res.status(500).json({ message: "Duplicate attendance found but failed to delete existing record", error: delErr.message });
                }
            }
            return res.status(400).json({ message: "Attendance already recorded today" });
        }
        res.status(500).json({ message: "Error creating attendance", error: error.message });
    }
}

async function getDailyStudentAttendance(req, res) {
    try {
        const { studentId, date } = req.body;
        
        const attendance = await Attendance.find({ studentId, date: new Date(date) })
            .sort({ date: -1 });
        
        if (!attendance.length) {
            return res.status(404).json({ message: "No attendance records found" });
        }
        
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: "Error fetching attendance", error: error.message });
    }
}

// Change attendance status
async function updateAttendanceStatus(req, res) {
    try {
        const { attendanceId, studentId, date } = req.body;
        const { status } = req.body;
        let updated;
        
        const validStatuses = ['Absent', 'Late-1hr', 'Late-2hrs', 'Present', 'Late-30mins', 'Permission'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        if (studentId && date) {
            updated = await Attendance.findOneAndUpdate(
                { student: studentId, day: date },
                { status },
                { new: true }
            );

            if (!updated) {
                return res.status(404).json({ message: "Attendance record not found" });
            }
        } else if (attendanceId) {
            updated = await Attendance.findByIdAndUpdate(
                attendanceId,
                { status },
                { new: true }
            );
            if (!updated) {
                return res.status(404).json({ message: "Attendance record not found" });
            }
        } else {
            return res.status(400).json({ message: "Either attendanceId or studentId and date must be provided" });
        }
        
        res.status(200).json({ message: "Attendance status updated", record: updated });
    } catch (error) {
        res.status(500).json({ message: "Error updating attendance", error: error.message });
    }
}

const postBulkAttendance = async (req, res) => {
    try {
        const attendanceData = req.body.data;
        const day = req.body.day || new Date().toISOString().split("T")[0]; // Default to today if no day provided

        console.log(attendanceData);
        // We use Promise.all to run all updates in parallel for better performance
        const updatePromises = Object.entries(attendanceData).map(async ([index, data]) => {
            console.log(`Processing attendance for student ${data.studentId} with status ${data.status}`);
            // 1. Create the attendance record
            const { studentId, status } = data;
            const newRecord = await Attendance.create({
                student: studentId,
                status: status,
                day: new Date(day).toISOString().split("T")[0]
            });

            // 2. Push the new record ID into the Student's attendance array
            return Student.findByIdAndUpdate(studentId, {
                $push: { attendance: newRecord._id }
            });
        });

        const results = await Promise.all(updatePromises);


        res.status(200).json({ 
            success: true, 
            records_created: results.length 
        });
    } catch (error) {
        console.error("Batch update failed:", error);
        res.status(500).json({ error: "Failed to process attendance" });
    }
};


const clearAllRecords = async (req, res) => {
    try {
        const deleted = await Attendance.deleteMany({});

        deleted.map(async (record) => {
            await Student.findByIdAndUpdate(record.student, { $pull: { attendance: record._id } });
        });

        res.status(200).json({ message: "All attendance records deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    getFullStudentAttendance,
    getDailyStudentAttendance,
    createYearlyAttendance,
    updateAttendanceStatus,
    createYearlyAttendanceAll,
    clearAllRecords,
    postBulkAttendance
};