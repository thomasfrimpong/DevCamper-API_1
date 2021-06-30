const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getCourses,
  getCourse,
  updateCourse,
  addCourse,
  deleteCourse,
} = require("../controllers/courses");

router.get("/", getCourses);

router.get("/:id", getCourse);

router.put("/:id", updateCourse);

router.post("/", addCourse);

router.delete("/:id", deleteCourse);

module.exports = router;
