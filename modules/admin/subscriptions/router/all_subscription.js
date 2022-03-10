const Data = require("../model");
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        await Data.find({}).lean().exec((err,data) =>{
            if(!data)
                return res.status(400).send({ status: false, message: `Not Found All Subscribe Data`,data})
            return res.status(200).send({ status: true , message: "All Subscribe Success ", data })
        })
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