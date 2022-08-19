const Data = require("../model");
const ApiError = require("../../../../errors/ApiError");

const route = async (req,res,next) => {
  try {
    let data = await Data.find({}).lean();
        
    if(data.length === 0){
      return next(new ApiError("Bad words update dont match", 404, data));
    }
    return res.send({ status: 200, message: "Bad words update success",data});
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