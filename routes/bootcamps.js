const express = require("express");
const courseRouter = require("./courses");

const router = express.Router();
const {
  getBootcamps,
  getBootcamp,
  addBootcamp,
  updateBootcamp,
  deleteBootcamp,
  uploadBootcampPhoto,
} = require("../controllers/bootcamp");
const { protect, authorize } = require("../middleware/auth");

//Re-route into other router resources
router.use("/:bootcampId/courses", courseRouter);

router.get("/", getBootcamps);

router.get("/:id", getBootcamp);

router.post("/", protect, addBootcamp);

router.put("/:id", protect, authorize("admin", "publisher"), updateBootcamp);

router.delete("/:id", protect, authorize("admin", "publisher"), deleteBootcamp);

router.put(
  "/:id/photo",
  protect,
  authorize("admin", "publisher"),
  uploadBootcampPhoto
);

module.exports = router;
