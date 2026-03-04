const router = require("express").Router();
const { 
    createYearlyAttendance, 
    updateAttendanceStatus, 
    getFullStudentAttendance, 
    getDailyStudentAttendance,
    clearAllRecords,
    createYearlyAttendanceAll,
    postBulkAttendance
 } = require("../Controllers/attendanceController");
const {protect } = require("../Controllers/authController");

router.get("/get-full", protect, getFullStudentAttendance);
router.get("/get-daily", protect, getDailyStudentAttendance);
router.post("/create-yearly", protect, createYearlyAttendance);
router.put("/update-status", protect, updateAttendanceStatus);
router.post("/create-yearly-all", protect, createYearlyAttendanceAll);
router.delete("/clear-records", protect, clearAllRecords);
router.post("/post-bulk", protect, postBulkAttendance);

module.exports = router;