const ApiError = require("../../../../errors/ApiError");
const Data = require("../model")

const route = async (req,res,next) => {
    try {
        let { userData } = req;
        await Data.find({ author: userData.id }).lean().exec((_,data) => {
            if(!data)
                return next(new ApiError("All payment not found",404));
            return res.status(200).send({ status: false, message: "All Payment Success", data })
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