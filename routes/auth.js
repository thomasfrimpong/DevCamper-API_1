const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

const { protect } = require("../middleware/auth");
router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getMe);

router.get("/logout", logout);

router.get("/profile", protect, getMe);

router.post("/forgotpassword", forgotPassword);

router.put("/:resettoken/:id", resetPassword);

module.exports = router;
