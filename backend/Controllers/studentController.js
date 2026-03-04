const Student = require("../Models/Student");
const Attendance = require("../Models/Attendance");
const dotenv = require("dotenv");

dotenv.config();

const allStudents = async (req, res) => {
    try {
        const students = await Student.find().populate({ path: 'attendance', select: '_id day status', options: { sort: { day: -1 } } }).sort({ section: -1, name: 1 });
        const studentsWithProfile = students.map(student => ({
            "id": student._id,
            "name": student.name,
            "section": student.section,
            "attendance": student.attendance
        }));
        res.status(200).json(studentsWithProfile);
    } catch (error) {
        console.log(error);
        res.status(401).json({"message": error.message});
    }
};

const getStudent = async (req, res) => {
    const {id} = req.body;
    try {
        const student = await Student.findById(id).populate({ path: 'attendance', select: '_id day status', options: { sort: { day: -1 } } });

        console.log(student.attendance);
        const student_profile = {
            id: student._id,
            name: student.name,
            section: student.section,
            attendance: student.attendance
        };

        res.status(200).json(student_profile);
    } catch (error) {
        res.status(401).json({"message": error.message});
    }
};

const createStudent = async (req, res) => {
    try {
        const { name, section } = req.body;

        // Create new student
        const newStudent = await Student.create({
            "name": name,
            "section": section
        });

        res.status(201).json({ 
            message: "Student created successfully",
            student: newStudent
        });
    } catch (error) {
        console.error("Creation error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { allStudents, getStudent, createStudent };