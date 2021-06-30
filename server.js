const express = require("express");
const dotenv = require("dotenv");
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const path = require("path");
const colors = require("colors");
const connectDB = require("./config/db");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
dotenv.config({ path: "./config/config.env" });
const app = express();

//Body Parser
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = connectDB();

app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

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
