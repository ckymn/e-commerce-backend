const Data = require("../model");
const storage = require("../../../../uploads/images");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let { userData, body } = req;
    let { arr } = body;

    if (Array.isArray(arr) && arr.length > 0) {
      arr.map(async (i) => {
        let d_img = await Data.deleteOne({ $and: [{ author: userData.id }, { _id: i }] });
        if(d_img.deletedCount === 0)
          return next(new ApiError("Store images didn't remove",409))
        //! GCS REMOVE 
        await storage.Delete(i).catch(console.error);
      });
      return res.status(200).send({ status: false, message: "Delete Images Success"})
    }
    return next(new ApiError("Delete images doesn't array",400))
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

module.exports = route;