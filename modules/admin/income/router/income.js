const Data = require("../../../store/payment/model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        await Data.find({})
            .populate({ path: 'author', select: 'sector_name -_id', options: { lean: true}})
            .lean().exec((err,data) => {
                if(err)
                    return next(new ApiError("Income not found",404));
                return res.status(200).send({ status: true, message: "All Payment Info Success", data })
        })
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500, null));
        }
        next(new ApiError(error?.message, 500));
    }
}

module.exports = route