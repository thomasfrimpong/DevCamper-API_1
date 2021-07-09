const express = require("express");
const router = express.Router({});

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");
const { protect, authorize } = require("../middleware/auth");

router.get("/", getReviews);

router.get("/:id", getReview);

router.use(protect);

router.use(authorize("admin", "user"));

router.post("/", createReview);

router.put("/:id", updateReview);

router.delete("/:id", deleteReview);

module.exports = router;
