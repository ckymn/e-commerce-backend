const ApiError = require("../../../../errors/ApiError");
const { Product_Comment } = require("../../../user/comment/model");

const route = async (req, res) => {
  try {
    let { params } = req;

    await Product_Comment.findOne({ _id: params.id }).lean().exec((err,data) =>{
      if(!data) 
        return next(new ApiError("Single product comment not found",404,data));
      return res.send({
        status: 200,
        message: "Single Product Comment Notification success",
        data,
      });
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