const mongoose = require("mongoose");
const env = require("./index");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(env("MONGO_URI"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      rejectUnauthorized: false,
    });
    console.log(
      `MongoDb connected name : ${connect.connection.name} on ${connect.connection.port} port`
    );
  } catch (error) {
    console.log("db default error : ", error);
    process.exit(1); // kill program
  }
};

//gecerli bir objectId oldugunu sorgular
const isValidId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = { connectDB, isValidId };
