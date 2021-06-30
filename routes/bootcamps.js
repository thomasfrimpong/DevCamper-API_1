const express = require("express");
const courseRouter = require("./courses");

const router = express.Router();
const {
  getBootcamps,
  getBootcamp,
  addBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require("../controllers/bootcamp");

//Re-route into other router resources
router.use("/:bootcampId/courses", courseRouter);

router.get("/", getBootcamps);

router.get("/:id", getBootcamp);

router.post("/", addBootcamp);

router.put("/:id", updateBootcamp);

router.delete("/:id", deleteBootcamp);

module.exports = router;
