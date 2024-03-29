const ApiError = require("../../../../errors/ApiError");
const Data = require("../../../store/products/model");

const route = async (req, res) => {
  try {
    let { params } = req;

    let data = await Data.findOne({ _id: params.id }).lean();
    if(!data) 
      return next(new ApiError("Single notification not found",404,[]));
    return res.send({
      status: 200,
      message: "Single Product Notification success",
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