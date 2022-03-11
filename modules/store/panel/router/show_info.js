const ApiError = require("../../../../errors/ApiError");
const Data = require("../../auth/model")

const route = async (req, res, next) => {
    try {
        let { id } = req.params;

        let data = await Data.findOne({ _id: id })
          .select("-_id name surname username storename")
        if(!data)
            return next(new ApiError("Store Not Found",404,[]));
        return res.send({ status: 200, message: "Seller Show Information success", data })
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204, []));
        }
        next(new ApiError(error?.message));
    }
}

module.exports = route