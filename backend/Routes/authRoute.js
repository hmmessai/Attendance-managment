const router = require("express").Router();
const { register, currentUser, login, protect } = require("../Controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/currentUser", protect, currentUser);

module.exports = router;