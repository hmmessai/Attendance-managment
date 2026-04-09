const router = require("express").Router();
const { register, currentUser, login, changePassword, protect } = require("../Controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/currentUser", protect, currentUser);
router.get("/change-password", protect, changePassword);

module.exports = router;