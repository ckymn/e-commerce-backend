const Data = require("../../auth/model");
const ApiError = require("../../../../errors/ApiError");
const doviz = require("../../../../utils/doviz");

const route = async (req,res,next) => {
  try {
    let { params, body , kuserData} = req;
    let currency = await doviz();

    await Data.findOne({ _id: kuserData.id })
      .select("favorite_product -_id")
      .populate({ path: "favorite_product" })
      .lean().exec((err,data) => {
        if(!data)
          return next(new ApiError("All Product Favorite Not Found",404,null));
        return res.send({
          status: 200,
          message: "Product Add Favorite Success",
          data,
          currency,
        });
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