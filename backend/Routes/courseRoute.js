const router = require("express").Router();
const { createCourse, getCourses, getCourse, getCoursesBySection, getCoursesByStudent, getStudentAttendanceByCourse } = require("../Controllers/courseController");
const { protect } = require("../Controllers/authController");

router.post("/create", createCourse);
router.get("/all", getCourses);
router.get("/get", getCourse);
router.get("/get-by-section", getCoursesBySection);
router.get("/get-by-student", getCoursesByStudent);
router.get("/get-student-attendance/:id", getStudentAttendanceByCourse);

module.exports = router;