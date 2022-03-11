require("dotenv").config();
const jwt = require("jsonwebtoken");
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
  try {
    let { userData } = req;

    await jwt.sign({ id: userData.id }, process.env.JWT_ACCESS_SECRET,{ expiresIn: 1 });

    return res.send({ status: 200, message: "logout was successed", data: [] });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 204, null));
    }
    next(new ApiError(error?.message));
}
};

module.exports = route;
