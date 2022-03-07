require("dotenv").config();
const jwt = require("jsonwebtoken");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let { adminData } = req;
    await jwt.sign({ id: adminData.id }, process.env.JWT_ACCESS_SECRET,{ expiresIn: "1ms" });
    return res.status(200).send({ status: true, message:"logout was successed"})
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 500, null));
    }
    next(new ApiError(error?.message, 500));
}
};

module.exports = route;
