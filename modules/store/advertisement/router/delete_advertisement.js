const Data = require("../model")
const storage = require("../../../../uploads/storeAds");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
        let { userData, params } = req;
        // GCS hata yakalama ...
        await storage.Delete(params.id);
        let d_ads = await Data.deleteOne({ _id: params.id  })
        if(d_ads.deletedCount === 0)
            return next(new ApiError("Delete store advertisement didn't match",404));
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