const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const path = require("path");

//@desc Get All Bootcamp
//@route GET /api/v1/bootcamps/
//@access Public
exports.getBootcamps = asyncHandler(async (req, res) => {
  //Operators in MongoDB
  /*const bootcamp = await Bootcamp.aggregate([
    { $limit: 2 },
    { $sort: { name: 1 } },
  ]);*/
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
  console.log(`${req.originalUrl}`);

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
  req.body.user = req.user.id;

  publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
  if (publishedBootcamp && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `User with id ${req.user.id} has already published a bootcamp`,
        403
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);

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

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} is not found`, 404)
    );
  }

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

  if (!bootcamp.user.toString() != req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(`Not authorized to update this bootcamp`, 403)
    );
  }
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

  if (!bootcamp.user.toString() != req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(`Not authorized to remove this bootcamp`, 403)
    );
  }
  await bootcamp.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

//@desc Upload a bootcamp photo
//@route PUT /api/v1/bootcamps/:id/photo
//@access Private

exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} is not found`, 404)
    );
  }

  if (!bootcamp.user.toString() != req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(`Not authorized to upload this bootcamp photo.`, 403)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please choose a file less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //console.log(path.parse(file.name).ext);
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (error) => {
    if (error) {
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photos: file.name });
  });

  res.status(200).json({
    success: true,
    data: file.name,
  });
});
