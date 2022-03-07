const ApiError = require("../../../../errors/ApiError");
const Data = require("../model")

const route = async (req, res, next) => {
    try {
        let { userData, params } = req;

        let r_product = await Data.deleteOne({ $and: [ {author: userData.id}, { _id: params.id } ] }).lean();
        if(r_product.deletedCount === 0)
          return next(new ApiError("Product delete didn't match",409));
        return res.status(200).send({ status: true, message: "Single product delete success" })
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        next(new ApiError(error?.message, 422));
      }
      if (error.code === 27) {
        next(new ApiError("We Don't Have Any Data", 500, null));
      }
      next(new ApiError(error?.message));
    }
}

module.exports = route