const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getCourses,
  getCourse,
  updateCourse,
  addCourse,
  deleteCourse,
} = require("../controllers/courses");

const { protect, authorize } = require("../middleware/auth");

router.get("/", getCourses);

router.get("/:id", getCourse);

router.put("/:id", protect, authorize("admin", "publisher"), updateCourse);

router.post("/", protect, authorize("admin", "publisher"), addCourse);

router.delete("/:id", protect, authorize("admin", "publisher"), deleteCourse);

module.exports = router;
