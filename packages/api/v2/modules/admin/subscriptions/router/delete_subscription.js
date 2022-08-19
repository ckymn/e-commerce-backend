const Data = require("../model");
const ApiError = require("../../../../errors/ApiError");


const route = async (req, res, next) => {
  try {
    let { params } = req;
        
    await Data.findOneAndDelete({ _id: params.id }).lean().exec(async (err,data) => {
      if(!data)
        return res.send({ status: 404, message: "Not Found Delete Subscribe",data});
      return res.send({ status: 200, message: "Delete Subscribe Success",data});
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