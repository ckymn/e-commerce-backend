const Data = require("../../../user/auth/model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        let { id } = req.params;

        let data = await Data.findOne({ _id: id })
            .select("-password")
            .lean().exec();
        if(!data)
            return res.send({ status: 404, message: "Not Found Any Store User", data})
        return res.send({status: 200, message: "Single Users Success", data })
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204, []));
        }
        next(new ApiError(error?.message, 500));
    }
}

module.exports = route