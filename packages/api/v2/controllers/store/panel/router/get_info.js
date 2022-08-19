const Data = require("../../auth/model");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let { id } = req.userData;

    let data = await Data.findOne({ _id: id }).lean();
    if(!data)
      return next(new ApiError("Store not found",404,[]));
    await Data.findOne({ _id: id }).lean().exec((_,data) => {
      if(!data)
        return next(new ApiError("Store update not found",404,[]));
    });
    return res.send({ status: 200, message: "Store Information success", data });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 204,[]));
    }
    next(new ApiError(error?.message));
  }
};

module.exports = route;