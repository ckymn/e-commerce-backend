const { Product_Comment } = require("../model")
const Product = require("../../../store/products/model");
const ApiError = require("../../../../errors/ApiError");

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;
        await Product_Comment.findOneAndRemove({ $and: [ { author: kuserData.id },{ _id: params.id } ] })
            .lean().exec(async (err,data) => {
                if(!data) 
                    return next(new ApiError("Delete Product Comment Not Found !",404))
                let p_update = await Product.updateOne({ _id: data.product_id }, 
                    { 
                        $pull: { 
                            comments: { 
                                $in : data._id 
                            }
                        }
                    }
                )
                if(p_update.matchedCount === 0)
                    return next(new ApiError("Delete Product Comment Success but Update Products Comment Failed",400))
                return res.status(200).send({ status: true, message: "Delete Product Comment and Update Products Comment Success" })
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
}

module.exports = route