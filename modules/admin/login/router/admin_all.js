const Data = require("../model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req,res,next) => {
    try {
        await Data.find({})
          .lean()
          .exec((err, data) => {
            if (!data) {
              return next(new ApiError("All admin not found",404,data));
            } else {
              return res.send({
                status: 200,
                message: "All Sub Admin  success ",
                data,
              });
            }
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
