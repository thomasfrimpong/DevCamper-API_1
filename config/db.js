const mongoose = require("mongoose");
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  console.log(`MongoDB connected at : ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
