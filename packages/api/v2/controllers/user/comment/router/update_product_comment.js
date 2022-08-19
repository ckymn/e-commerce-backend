const ApiError = require("../../../../errors/ApiError");
const { Product_Comment } = require("../model");

const route = async( req,res,next) => {
  try {
    let { body ,kuserData , params} = req;
    await Product_Comment.updateOne({ $and: [ {author: kuserData.id},{_id: params.id} ]},
      {
        $set: {
          "comment": body.comment,
          "rate": body.rate
        }
      }
    ).exec(async(err,data) => {
      if(data.matchedCount === 0)
        return next(new ApiError("Update product comment didn't match",404,[]));
      return res.send({ status: 200, message: "User to Update Product Comment Success" ,data });
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