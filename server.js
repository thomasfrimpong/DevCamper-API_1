const express = require("express");
const dotenv = require("dotenv");
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const users = require("./routes/users");
const auth = require("./routes/auth");

const path = require("path");
const colors = require("colors");
const connectDB = require("./config/db");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
dotenv.config({ path: "./config/config.env" });
const app = express();
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");

//Body Parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

//mongodb connection
const db = connectDB();

//file upload
app.use(fileupload());

app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);

//Error Handler middleware
app.use(errorHandler);

const port = process.env.PORT || 5000;

server = app.listen(port, () => {
  console.log(
    `Server is running in  ${process.env.NODE_ENV} mode on port ${port}`.magenta
  );
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Unhandled error: ${err.message} `.red);
  server.close(() => {
    process.exit(1);
  });
});
