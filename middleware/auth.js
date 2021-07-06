const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  /*if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }*/
  token = req.cookies.token;
  //console.log(req.headers);
  console.log(req.cookies.token);

  if (!token) {
    return next(new ErrorResponse(`Not authorized to access this route`, 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Get users details
    req.user = await User.findById(decoded.id);
    console.log(req.user);
    next();
  } catch (error) {
    console.error(error);
    return next(new ErrorResponse("Not authorized to access this route", 403));
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User ${req.user.id} can't perform this action.`, 401)
      );
    }
    next();
  };
};
