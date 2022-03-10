const ApiError = require("../../../../errors/ApiError");
const Data = require("../model")

const route = async (req,res,next) => {
    try {
        let { params } = req;
        await Data.findOne({ _id: params.id}).lean().exec((_,data) => {
            if(!data)
                return next(new ApiError("Single solution partner not found",404,data));
            return res.status(200).send({
              status: true,
              message: "Single Solution Partner success ",
              data
            }); 
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
};

module.exports = route