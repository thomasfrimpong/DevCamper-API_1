const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

//@desc Get courses
//@route GET /api/v1/courses
//@access Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find();

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

//@desc Get courses
//@route GET /api/v1/courses/:id
//@access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course)
    return next(
      new ErrorResponse(`Course with id ${req.params.id} is not found`, 404)
    );

  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc Add course
//@route POST /api/v1/courses/
//@access Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp)
    return next(
      new ErrorResponse(
        `Bootcamp with id ${req.params.bootcampId} is not found`,
        404
      )
    );

  req.body.bootcamp = req.params.bootcampId;
  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course,
  });
});

//@desc Update course
//@route PUT /api/v1/courses/:id
//@access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course)
    return next(
      new ErrorResponse(`Course with id ${req.params.id} is not found`, 404)
    );

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc Delete course
//@route DELETE /api/v1/courses/:id
//@access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course)
    return next(
      new ErrorResponse(`Course with id ${req.params.id} is not found`, 404)
    );

  course = await Course.findById(req.params.id);
  course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
