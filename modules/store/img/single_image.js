const Data = require("../products/model");
const ApiError = require("../../../errors/ApiError");

const route = async (req, res) => {
	try {
    let { userData, params } = req;
    let data = await Data.find({ $and:[ { author: userData.id },{ _id: params.id } ]}).lean()
    if(!data){
      return res
        .status(404)
        .send({ status: false, message: "There is no matching images data" });
    }else{
      return res.status(200).send({ status: true, message:"Single Images success", data })
    }
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