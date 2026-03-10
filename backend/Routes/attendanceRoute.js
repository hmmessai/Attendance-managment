const router = require("express").Router();
const { 
    createYearlyAttendance, 
    updateAttendanceStatus, 
    getFullStudentAttendance,
    getFullStudentsAttendanceonSpecificDate,
    getDailyStudentAttendance,
    clearAllRecords,
    createYearlyAttendanceAll,
    postBulkAttendance,
    dailyAttendanceAll
 } = require("../Controllers/attendanceController");
const {protect } = require("../Controllers/authController");

router.get("/get-full", protect, getFullStudentAttendance);
router.post("/get-full-by-date", getFullStudentsAttendanceonSpecificDate);
router.get("/get-daily", protect, getDailyStudentAttendance);
router.post("/create-yearly", protect, createYearlyAttendance);
router.put("/update-status", protect, updateAttendanceStatus);
router.post("/create-yearly-all", protect, createYearlyAttendanceAll);
router.delete("/clear-records", protect, clearAllRecords);
router.post("/post-bulk", protect, postBulkAttendance);
router.post("/daily-all", protect, dailyAttendanceAll);

module.exports = router;