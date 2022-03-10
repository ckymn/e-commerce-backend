const ApiError = require("../../../../errors/ApiError");
const Data = require("../model")
const storage = require("../../../../uploads/images");

const route = async (req, res, next) => {
    try {
        let { userData, params } = req;
        let data = await Data.findOneAndDelete({
          $and: [{ author: userData.id }, { _id: params.id }],
        }).select("variants.images._id").lean();

        for(let i = 0; i < data.variants.length; i++){
          data.variants[i].images.map(async i => {
            await storage.Delete(i._id)
          })
        }
        
        if(!data)
          return next(new ApiError("Product delete didn't match",404));
        return res.status(200).send({ status: true, message: "Single product delete success"})
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        next(new ApiError(error?.message, 422));
      }
      if (error.code === 27) {
        next(new ApiError("We Don't Have Any Data", 500));
      }
      next(new ApiError(error?.message));
    }
}

module.exports = route