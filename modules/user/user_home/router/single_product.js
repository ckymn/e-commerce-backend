const { ObjectId } = require("mongodb");
const ApiError = require("../../../../errors/ApiError");
const Products = require("../../../store/products/model")
const doviz = require("../../../../utils/doviz")

const route = async (req,res,next) => {
    try {
        let { params, query ,kuserData} = req;

        let data = await Products.aggregate([
          { $match: { _id: ObjectId(params.id) } },
          {
            $lookup: {
              from: "product_comments",
              let: { comments: "$comments" },
              pipeline: [
                {
                  $match: {
                    $expr: { $in: ["$_id", "$$comments"] },
                  },
                },
                { $project: { _id: 0 } }, // suppress _id
              ],
              as: "product_of_comments",
            },
          },
          {
            $lookup: {
              from: "product_stars",
              let: { star: "$star" },
              pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$star"] } } },
                { $project: { _id: 0 } }, // suppress _id
              ],
              as: "product_of_star",
            },
          },
          {
            $lookup: {
              from: "users",
              let: { favorite: "$favorite" },
              pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$favorite"] } } },
                { $project: { _id: 0 } }, // suppress _id
              ],
              as: "product_of_favorite",
            },
          },
          {
            $project: {
              _id: 0,
              item: "$$ROOT",
              is_favorite: { $in: [ObjectId(kuserData.id), "$favorite"] },
            },
          },
        ]);
        if(data.length === 0)
          return next(new ApiError("Single Product Not Found",200,data))
        let currency = await doviz();
        return res
          .status(200)
          .send({
            status: true,
            message: "Single Products and Stories are success ",
            data,
            currency
          });
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        next(new ApiError(error?.message, 422));
      }
      if (error.code === 27) {
        next(new ApiError("We Don't Have Any Data", 500, null));
      }
      next(new ApiError(error?.message));
    }
};

module.exports = route;