const mongoose = require("mongoose");

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  description: {
    type: String,
    unique: false,
    trim: false,
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/,
      "Please enter a valid url.",
    ],
  },
  email: {
    type: String,
    match: [
      /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
      "Please enter a valid email.",
    ],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  location: {
    type: String,
    enum: ["Point"],
    required: false,
  },
  coordinates: {
    type: Number,
    required: false,
    index: "2dsphere",
  },
  slug: {
    type: String,
    required: false,
    maxlength: [50, "Please don't more than 50 characters."],
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating must not be more than 10"],
  },
  averageCost: Number,
  photos: {
    type: String,
    default: "no-photo.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  formattedAddress: String,
  street: String,
  zipcode: String,
  city: String,
  state: String,
  country: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Cascade delete courses when a bootcamp is deleted
BootcampSchema.pre("remove", async function (next) {
  await console.log(
    `Courses are being deleted from bootcamp ${this._id}`.orange
  );
  await this.model("Course").deleteMany({ bootcamp: this._id });
  next();
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
