const { Product_Star } = require("../model")
const Product = require("../../../store/products/model")
const ApiError = require("../../../../errors/ApiError")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;

        await Product_Star.findOneAndRemove({ $and:[{ product_id: params.id }, { author: kuserData.id }] })
            .lean().exec(async(err,data) => {
                if(!data)
                    return next(new ApiError("Delete product star Not found",404,null))
                let p_data = await Product.updateOne({ _id: params.id },
                    {
                        $pull: {
                            star:{
                                $in: data._id
                            }
                        }
                    })
                if(p_data.matchedCount === 0)
                    return next(new ApiError("Update star product didn't match",404,null))
                return res.send({ status: 200, message: "Delete product star success",data})
            })
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204, null));
        }
        next(new ApiError(error?.message));
    }
}

module.exports = route