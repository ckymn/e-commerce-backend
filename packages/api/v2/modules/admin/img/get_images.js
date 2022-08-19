const Data = require("../products/model");
const ApiError = require("../../../errors/ApiError");
const { ObjectId } = require("mongodb");

const route = async (req, res,next) => {
  try {
    let { userData } = req;
    let data = await Data.aggregate([
      {
        $match: { author: ObjectId(userData.id) },
      },
      {
        $project: {
          _id: 0,
          "variants.images":1
        }
      }
    ]);
    if(data.length === 0)
      return next(new ApiError("not found any images",404,[]));
    return res.send({ status: 200, message: "All Images success", data });
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