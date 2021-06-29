const express = require("express");

const router = express.Router();
const {
  getBootcamps,
  addBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require("../controllers/bootcamp");

router.get("/", getBootcamps);

router.post("/", addBootcamp);

router.put("/:id", updateBootcamp);

router.delete("/:id", deleteBootcamp);

module.exports = router;
