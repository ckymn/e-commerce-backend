const { Product_Star } = require("../model")
const ApiError = require("../../../../errors/ApiError")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;
        await Product_Star.updateOne({ $and:[{ product_id: params.id }, { author: kuserData.id }] }, {
            $set: {
                rate: body.rate
            }
        }, { new: true })
        .lean().exec(async(err,data) => {
            if(data.matchedCount === 0)
                return next(new ApiError("Update product star didn't match",404));
            return res.status(200).send({ status: true, message: "User Update Product Comment Success"})
        })
        
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