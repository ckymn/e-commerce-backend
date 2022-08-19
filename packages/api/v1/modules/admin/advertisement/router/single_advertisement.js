const ApiError = require("../../../../errors/ApiError");
const Data = require("../model");

const route = async (req, res, next) => {
  try {
    let { params } = req;
    let data = await Data.findOne({ _id : params.id });
    if(!data)
      return next(new ApiError("Admin Single Advertisement not found",404,[]));
    return res.send({
      status: 200,
      message: "Admin Single Advertisement success",
      data,
    });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 204, []));
    }
    next(new ApiError(error?.message));
  }
};

module.exports = route;