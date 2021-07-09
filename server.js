const express = require("express");
const dotenv = require("dotenv");
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const users = require("./routes/users");
const auth = require("./routes/auth");
const reviews = require("./routes/reviews");
const path = require("path");
const colors = require("colors");
const connectDB = require("./config/db");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
dotenv.config({ path: "./config/config.env" });
const app = express();
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

//Body Parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// To remove data, use:
app.use(mongoSanitize());

app.use(helmet());

app.use(xss());

app.use(hpp());

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

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
app.use("/api/v1/reviews", reviews);

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
