const ApiError = require("../../../../errors/ApiError");
const Data = require("../model")

const route = async (req,res,next) => {
    try {
        let { params } = req;
        await Data.findOneAndDelete({ _id: params.id }).lean().exec((err,data) => {
            if(!data)
                return next(new ApiError("Delete solution partner not found",404, data));
            return res.send({
              status: 200,
              message: "Delete Solution Partner success ",
            }); 
        })
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204, []));
        }
        next(new ApiError(error?.message));
    }
};

module.exports = route