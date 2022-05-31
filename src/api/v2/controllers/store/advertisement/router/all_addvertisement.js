const Data = require("../model");
const storage = require("../../../../scripts/images");
const ApiError = require("../../../../errors/ApiError");
const { ObjectId } = require("mongodb");

const route = async (req, res, next) => {
  try {
    let { userData } = req;

    let d_w = await Data.find({
      $and: [{ author: userData.id }, { is_approved: { $in: "wait" } }],
    }).lean();
    let d_n = await Data.find({
      $and: [{ author: userData.id }, { is_approved: { $in: "no" } }],
    }).lean();
    let d_y = await Data.find({
      $and: [{ author: userData.id }, { is_approved: { $in: "yes" } }],
    }).lean();

    if (d_w.length === 0 && d_n.length === 0 && d_y.length === 0)
      return next(new ApiError("all store not found", 404, []));

    return res.send({
      status: 200,
      message: "store ads success",
      data: { d_w, d_n, d_y },
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
