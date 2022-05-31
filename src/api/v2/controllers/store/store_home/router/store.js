const Data = require("../../auth/model");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let { userData } = req;
    let current_time = new Date();
    let data = await Data.findOne({ _id: userData.id });

    await Data.findOneAndUpdate(
      {
        $and: [
          { _id: userData.id },
          {
            "remain_date.created_at": {
              $lte: new Date(+new Date() + 24 * 3600 * 1000),
            },
          },
        ],
      },
      {
        $inc: {
          "remain_date.time": -Math.abs(
            current_time.getDate() - data.remain_date.created_at.getDate()
          ),
        },
        $set: {
          "remain_date.created_at": new Date(),
        },
      }
    )
      .populate({ path: "comment", select: "comment rate" })
      .populate({ path: "follow", select: "username" })
      .select("-password")
      .lean()
      .exec((err, data) => {
        if (!data) return next(new ApiError("Store not found", 404, []));

        return res.send({ status: 200, message: "Store data success", data });
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
