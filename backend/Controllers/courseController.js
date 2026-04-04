const Attendance = require("../Models/Attendance");
const Course = require("../Models/Course");
const Student = require("../Models/Student");

const createCourse = async (req, res) => {
  console.log(req.body);
    try {
        const { name, section, start_date, end_date, teacher, status, created_by } = req.body;

        
        const newCourse = new Course({
            name,
            section,
            start_date,
            end_date,
            teacher,
            created_by: created_by,
            status: status
        });

        const course = await newCourse.save();

        await Student.updateMany(
            { section: section },
            { $addToSet: { course: course._id } }
        );

        res.status(201).json({ message: "Course created successfully", course: newCourse });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getCourses = async (req, res) => {
  const section = req.query.section;
  try {
    let courses;
    if (!section) {
      courses = await Course.find().populate('created_by', 'name');
    } else {
      courses = await Course.find({ section: section }).populate('created_by', 'name');
    }
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: error.message });
  }
};

const getCourse = async (req, res) => {
  const { id } = req.query;
  try {
    const course = await Course.findById(id).populate('created_by', 'name');
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: error.message });
  }
};

const getCoursesBySection = async (req, res) => {
  const { sectionId } = req.query;
  try {
    const courses = await Course.find({ section: sectionId }).populate('section', 'name');
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses by section:", error);
    res.status(500).json({ message: error.message });
  }
};

const getCoursesByStudent = async (req, res) => {
  const { studentId } = req.query;
  try {
    const student = await Student.findById(studentId).populate('course', 'name');
    res.status(200).json(student.course);
  } catch (error) {
    console.error("Error fetching courses by student:", error);
    res.status(500).json({ message: error.message });
  }
};

const getStudentAttendanceByCourse = async (req, res) => {
  const studentId = req.params.id;
  const courseId = req.query.courseId;
  try {
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);
    console.log(student, course);
    if (!course || !student) {
      return res.status(404).json({ message: "Course or student not found" });
    }
    console.log(course.start_date, course.end_date, course.section);
    const attendance = await Attendance.find({
        student: studentId,
        type: { 
          $in: ["ትምህርት", "ትምህርትና መዝሙር"]
        },
        day: {
          $gte: course.start_date,
          $lte: course.end_date
        }
    });
    res.status(200).json(attendance);
  } catch (error) {
    console.error("Error fetching student attendance by course:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    createCourse,
    getCourses,
    getCourse,
    getCoursesBySection,
    getCoursesByStudent,
    getStudentAttendanceByCourse,
};