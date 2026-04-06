const router = require("express").Router();
const { createCourse, getCourses, getCourse, addStudentToCourse, getCourseStudents, getCoursesBySection, getCoursesByStudent, getStudentAttendanceByCourse, updateCourse } = require("../Controllers/courseController");
const { protect } = require("../Controllers/authController");

router.post("/create", createCourse);
router.get("/all", getCourses);
router.get("/get", getCourse);
router.post("/add-student", addStudentToCourse);
router.get("/get-students", getCourseStudents);
router.get("/get-by-section", getCoursesBySection);
router.get("/get-by-student", getCoursesByStudent);
router.get("/get-student-attendance/:id", getStudentAttendanceByCourse);
router.post("/update", protect, updateCourse);

module.exports = router;