const ApiError = require("../../../../errors/ApiError");
const Data = require("../../../store/auth/model")

const route = async (req, res, next) => {
    try {
        let { id } = req.params;

        let data = await Data.findOne({ _id: id }).select("-password -search_count -location_search_count -wp_msg_count")
            .populate({ path: "comment"})
            .populate({ path: "follow" , select: "username" })
            .lean().exec();
        if(!data)
            return next(new ApiError("Single store not found",404,data));
        return res
          .status(200)
          .send({ status: true, message: "Single Users Success", data });
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500));
        }
        next(new ApiError(error?.message, 500));
    }
}

module.exports = route