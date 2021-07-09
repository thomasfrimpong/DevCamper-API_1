const Review = require("../models/Review");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

exports.getReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

exports.getReview = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);
  const review = await Review.find({ bootcamp: req.params.id });

  res.status(200).json({
    success: true,
    data: review,
  });
});

exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const review = await Review.create(req.body);

  res.status(200).json({
    success: true,
    data: review,
  });
});

exports.updateReview = asyncHandler(async (req, res, next) => {
  let review;
  review = await Review.findById(req.params.id);
  if (req.user.id !== review.user.toString() && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to update this review`, 403));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (req.user.id !== review.user.toString() && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to remove this review`, 403));
  }

  review.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
