const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Token = require("../models/Token");
const JWT = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });

  sendResponseToken(user, 201, res);
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse(`Please enter email and password`, 401));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse(`Invalid Credentials`, 401));
  }

  //check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid Credentials`, 401));
  }

  sendResponseToken(user, 200, res);
});

//Get credentials of the user
exports.getMe = asyncHandler(async (req, res) => {
  console.log(req.user.id);
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

//Logout user and clear cookies
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, data: {} });
});

//Send link to user to reset password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse(`User does not exist`, 404));
  }

  let token = await Token.findOne({ userId: user._id });
  if (token) {
    token.remove();
  }

  //Create reset token
  let resetToken = crypto.randomBytes(32).toString("hex");
  //Hash token
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(resetToken, salt);

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/${resetToken}/${user._id}`;

  const message = `You are getting this email because you (or someone) else has request the reset of the password. Please make a PUT request to: \n\n ${resetUrl}. Reset link expires in an hour time.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    await Token.create({
      userId: user._id.toString(),
      token: hash,
      createdAt: Date.now(),
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (error) {
    console.log(error);

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

//Reset Password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const passwordResetToken = await Token.findOne({
    userId: req.params.id,
  });

  if (!passwordResetToken) {
    return next(new ErrorResponse("Record not found", 500));
  }
  //console.log(passwordResetToken.token);
  const isValid = await bcrypt.compare(
    req.params.resettoken,
    passwordResetToken.token
  );

  if (!isValid) {
    return next(
      new ErrorResponse("Invalid or expired password reset token", 500)
    );
  }
  //Set new Password
  //Hash token
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);

  let user;
  user = await User.updateOne(
    { _id: passwordResetToken.userId },
    { $set: { password: hash } },
    { new: true }
  );
  res.status(200).json({ success: true, data: user });

  //Give user feedback
  user = await User.findById({ _id: req.params.id });
  try {
    await sendEmail({
      email: user.email,
      subject: "Password changed successfully",
      message: "Password Reset Successfully",
    });

    await passwordResetToken.deleteOne();
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (error) {
    console.log(error);

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

//
const sendResponseToken = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV == "production") {
    options.secure = true;
  }
  console.log(options);

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    data: user,
    token,
  });
};
