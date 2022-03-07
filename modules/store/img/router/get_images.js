const Data = require("../model");
const storage = require("../../../../uploads/images");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res) => {
	try {
    let { userData } = req;

    await Data.find({ author: userData.id })
      .lean()
      .exec((err, data) => {
        if (data.length === 0)
          return next(new ApiError("Store images not found", 404));
        return res
          .status(200)
          .send({
            status: true,
            message: `Store Images get from product success`,
          });
      });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 500, null));
    }
    next(new ApiError(error?.message));
  }
};

module.exports = route;