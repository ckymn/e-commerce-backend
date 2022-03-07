const Data = require("../model")
const storage = require("../../../../uploads/storeStorys");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
        let { userData, params } = req;

        await storage.Delete(params.id).catch("hata : ",console.error);
        let d_story = await Data.deleteOne({ $and:[ { author: userData.id }, { _id: params.id } ] })
        if(d_story.deletedCount === 0)
          return next(new ApiError("Delete story didn't match",409));
        return res.status(200).send({ status: true, message: "Delete Store story success" })
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