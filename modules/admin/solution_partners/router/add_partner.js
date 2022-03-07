const Data = require("../model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req,res,next) => {
    try {
        let { body } = req;
        let data = await new Data({
            ...body
        }).save();
        if(!data) 
            return next(new ApiError("Solution partner create dont work",400));
        return res.status(200).send({ status: true, message: "Solution Partner Data Success ", data })
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500, null));
        }
        next(new ApiError(error?.message, 500));
    }
};

module.exports = route