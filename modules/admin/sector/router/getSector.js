const ApiError = require("../../../../errors/ApiError");
const { Sector } = require("../model")

const route = async (req,res,next) => {
    try {
        let data = await Sector.find({}).lean().exec();
        if(!data)
          return next(new ApiError("Sector not found", 404));         
        return res
          .status(200)
          .send({ status: true, message: "Admin Sector success", data });
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
module.exports = route
