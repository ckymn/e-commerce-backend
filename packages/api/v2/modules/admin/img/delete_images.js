const storage = require("../../../uploads/images");
const ApiError = require("../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let { arr } = req.body;
    for (let i = 0; i < arr.length; i++) {
      await storage.Delete(arr[i]);
    }
    return res.send({
      status: 200,
      message: "Delete Images Success",
      data: [],
    });
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
