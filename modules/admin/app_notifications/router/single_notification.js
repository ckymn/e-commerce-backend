const Data = require("../model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        let { body , params } = req;

        await Data.findOne({ _id: params.id }).lean().exec((err,data) => {
            if(!data)
                return next(new ApiError("app notification not found",400, data));
            return res.send({ status: 200, message: "Single Application Notification success", data })
        });
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204, null));
        }
        next(new ApiError(error?.message, 500));
    }
}

module.exports = route