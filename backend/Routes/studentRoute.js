const router = require("express").Router();
const { allStudents, getStudent, createStudent, getStudentByUser } = require("../Controllers/studentController");
const {protect } = require("../Controllers/authController");

router.get("/all", allStudents);
router.get("/get", protect, getStudent);
router.post("/create", protect, createStudent);
router.get("/get-by-user", protect, getStudentByUser);

module.exports = router;