const ApiError = require("../../../../errors/ApiError");
const Data = require("../model")

const route = async (req, res, next) => {
    try {
        let { params, userData } = req;

        let s_d = await Data.findOne({ $and: [ { author: userData.id }, { _id: params.id } ] }).lean();
        if(!s_d)    
            return next(new ApiError("Single advertiement not found",404));
        return res.status(200).send({ status: true, message: "Single Advertisement search success", data: s_d })
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500, null));
        }
        next(new ApiError(error?.message));
    }
}

module.exports = route