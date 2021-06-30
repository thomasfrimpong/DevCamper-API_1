const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

//@desc Get All Bootcamp
//@route GET /api/v1/bootcamps/
//@access Public
exports.getBootcamps = asyncHandler(async (req, res) => {
  //Operators in MongoDB
  //const bootcamp = await Bootcamp.aggregate([{ $limit: 2 }]);
  //const bootcamp = await Bootcamp.aggregate([{ $sort: { name: -1 } }]);
  //(gt|gte|lt|lte|eq)
  //const courses = await Courses.find({ tuition: { $gt: 8000 } });
  //const courses = await Courses.find({ tuition: { $lt: 5000 } });
  /*const bootcamp = await Bootcamp.find({
    $and: [{ name: "Civil Engineering" }, { email: "enroll@devworks.com" }],
  });*/
  //Selecting specific fields
  /*const bootcamp = await Bootcamp.aggregate([
    { $project: { _id: 0, name: 1, description: 1 } },
  ]);*/

  const bootcamp = await Bootcamp.find();

  res.status(200).json({
    success: true,
    count: bootcamp.length,
    data: bootcamp,
  });
});

//@desc Add a bootcamp
//@route POST /api/v1/bootcamps/
//@access Private
exports.addBootcamp = asyncHandler(async (req, res, next) => {
  bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc Add a bootcamp
//@route POST /api/v1/bootcamps/
//@access Private
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} is not found`, 404)
    );

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc Update a bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} is not found`, 404)
    );
  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

//@desc Delete a bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} is not found`, 404)
    );
  await bootcamp.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
