const Data = require("../model")
const storage = require("../../../../uploads/images");
const ApiError = require("../../../../errors/ApiError");
const { ObjectId } = require("mongodb");

const route = async (req,res,next) => {
    try {
        let { userData } = req;

        let data = await Data.aggregate([
          { $match: { author: ObjectId(userData.id) } },
          { $unwind: { path: "$is_approved" }}
        ]);

        if(data.length === 0)
            return res.send({ status: 400, messsage: "store ads not found", data})
        return res.send({ status: 200, message: "store ads success", data });

    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204,[]));
        }
        next(new ApiError(error?.message));
    }
}

module.exports = route; 