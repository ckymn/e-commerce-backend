const ApiError = require("../../../../errors/ApiError");
const Data = require("../model")

const route = async(req,res,next) => {
    try {
        let { body ,params, userData } = req;

        let _data = await Data.findOneAndUpdate(
          {
            $and: [{ author: userData.id }, { _id: params.id }],
          },
          {
            $set: {
              ...body,
              variants: body.variants,
              futures: body.futures,
            },
          }
        );
        if(!_data)
          return next(new ApiError("Product update not found",404));
        return res.status(200).send({ status: true, message: "Update Data Product Success", data})
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