const Student = require("../Models/Student");
const Attendance = require("../Models/Attendance");
const Course = require("../Models/Course");
const User = require ("../Models/User");
const dotenv = require("dotenv");

dotenv.config();

const allStudents = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
  try {
    let students;
    console.log(req.query);
    if (req.query.section) {
      const section = req.query.section;
      students = await Student.find({ section }).sort({ section: 1 }).skip((page - 1) * 10).limit(10);
    } else {
      students = await Student.find().sort({ section: 1 }).skip((page - 1) * 10).limit(10);
    }

    students = students.filter(a => a.student !== null);
    const totalPages = Math.ceil(await Student.countDocuments(req.query.section ? { section: req.query.section } : {}) / 10);
    const studentsWithProfile = await Promise.all(
      students.map(async (student) => {
        const attendance = await Attendance.find({ student: student._id });
        return {
          id: student._id.toString(), // Ensure string ID
          name: student.name || "Unknown",
          section: student.section || "Unknown",
          attendance: attendance.map((att) => ({
            id: att._id.toString(),
            day: att.day,
            status: att.status,
            type: att.type,
            locked: att.locked || false,
          })),
        };
      })
    );

    // Return the complete array
    res.status(200).json({
        students: studentsWithProfile,
        totalPages: totalPages
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: error.message });
  }
};

const getStudent = async (req, res) => {
    const {id} = req.query;
    console.log(id)
    try {
        const student = await Student.findById(id);
        const courses = await Course.find({_id: {$in: student.course}});

        const attendance = await Attendance.find({'student': id});
        if (!student) {
            console.log("Studnet not found");
            return res.status(404).json({"message": "Student not found"})
        }
        const student_profile = {
            id: student._id,
            name: student.name,
            section: student.section,
            attendance: attendance,
            course: courses ? courses.map((course) => ({
                id: course._id,
                name: course.name,
                start_date: course.start_date,
                end_date: course.end_date,
                status: course.status
            })) : []  
        };

        res.status(200).json(student_profile);
    } catch (error) {
        console.log(error);
        res.status(401).json({"message": error.message});
    }
};

const getStudentByUser = async (req, res) => {
    const user = req.user
    try {
        const userdata = await User.findById(user.id).populate({ path: 'student_id', select: '_id name section' });

        res.status(201).json({'students': userdata.student_id});
    } catch (error){
        res.status(500).json({'message': error.message});
    };
}

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


module.exports = { allStudents, getStudent, createStudent, getStudentByUser };